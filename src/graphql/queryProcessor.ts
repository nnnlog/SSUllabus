import {Database} from "sqlite3";
import {RootResolver} from "@hono/graphql-server";
import {Context} from "hono";
import {CreditDB, LectureRoomDB, LectureRoomTimeTableDB, SubjectDB, SubjectLectureRoomTimeDB, SubjectMajorDB, SubjectMultiMajorDB} from "../types/db";
import {QueryCreditsArgs, QueryLecture_Room_TimetableArgs, QueryLecture_RoomsArgs, QueryMajor_ListsArgs, QueryMulti_Major_ListsArgs, QuerySubjectArgs} from "../types/graphql";

import {buildBoolean, buildInt, buildIntRange, buildQuery, buildString, buildStringIncluded} from "./buildQuery";

export default (db: Database): RootResolver => (ctx?: Context) => {
    return {
        subject: async (a: QuerySubjectArgs) => {
            let subjectQueryInfos: ([string, any[]])[] = [];

            subjectQueryInfos.push(["(subject.year == (?))", [a.year]]);
            subjectQueryInfos.push(["(subject.semester == (?))", [a.semester]]);

            subjectQueryInfos.push(buildString("subject.grade_rule", a.grade_rule));
            subjectQueryInfos.push(buildString("subject.grade_scale", a.grade_scale));
            subjectQueryInfos.push(buildString("subject.lang", a.lang));

            subjectQueryInfos.push(buildBoolean("subject.is_el", a.is_el));
            subjectQueryInfos.push(buildBoolean("subject.is_capstone", a.is_capstone));
            subjectQueryInfos.push(buildBoolean("subject.limited_target", a.limited_target));

            subjectQueryInfos.push(buildStringIncluded(["subject.code", "subject.name", "subject.professor"], a.keyword)); // not exact search

            subjectQueryInfos.push(buildString("subject.code", a.code));

            subjectQueryInfos.push(buildString("subject.bunban", a.bunban));
            subjectQueryInfos.push(buildString("subject.open_department", a.open_department));

            subjectQueryInfos.push(buildInt("subject.credit", a.credit)); // number search
            subjectQueryInfos.push(buildIntRange("subject.listen_count", a.listen_count)); // number search
            subjectQueryInfos.push(buildIntRange("subject.remain_count", a.remain_count)); // number search

            subjectQueryInfos.push(buildString("subject.process", a.process));
            subjectQueryInfos.push(buildString("subject.target", a.target));


            let multiMajorQueryInfos: ([string, any[]])[] = [];
            multiMajorQueryInfos.push(["(subject_multi_major.year == (?))", [a.year]]);
            multiMajorQueryInfos.push(["(subject_multi_major.semester == (?))", [a.semester]]);
            multiMajorQueryInfos.push(buildString("subject_multi_major.isu_name", a.multi_majors));


            let majorQueryInfos: ([string, any[]])[] = [];
            majorQueryInfos.push(["(subject_major.year == (?))", [a.year]]);
            majorQueryInfos.push(["(subject_major.semester == (?))", [a.semester]]);
            majorQueryInfos.push(buildString("subject_major.isu_name", a.majors));


            return await new Promise(r => {
                db.all(`
                            select subject.*,
                                   json_group_array(distinct (subject_multi_major.isu_name)) as multi_majors_raw,
                                   json_group_array(distinct (subject_major.isu_name))       as majors_raw,
                                   json_group_array(distinct (json_object(
                                           'place',
                                           time_place.place,
                                           'day',
                                           time_place.day,
                                           'time_start',
                                           time_place.time_start,
                                           'time_end',
                                           time_place.time_end
                                                              )))                            as time_place_raw
                            from subject
                                     left join subject_multi_major on subject.year = subject_multi_major.year and subject.semester = subject_multi_major.semester and subject.code = subject_multi_major.code
                                     left join subject_major on subject.year = subject_major.year and subject.semester = subject_major.semester and subject.code = subject_major.code
                                     left join time_place on subject.year = time_place.year and subject.semester = time_place.semester and subject.code = time_place.code
                            where ${buildQuery(subjectQueryInfos)}
                              and ${a.multi_majors ? `(subject.code in (select subject_multi_major.code
                                                    from subject_multi_major
                                                    where ${buildQuery(multiMajorQueryInfos)}))` : "TRUE"}
                              and ${a.majors ? `(subject.code in (select subject_major.code
                                                    from subject_major
                                                    where ${buildQuery(majorQueryInfos)}))` : "TRUE"}
                            group by subject.year, subject.semester, subject.code
                            order by subject.name, subject.code;
                    `,
                    ([subjectQueryInfos, a.multi_majors ? multiMajorQueryInfos : [], a.majors ? majorQueryInfos : []].map<any[][]>(a => a.map(b => b[1]).flat())).flat(),
                    (err, row: SubjectDB[]) => {
                        for (let obj of row) {
                            obj.majors = (JSON.parse(obj.majors_raw) as (string | null)[]).filter(a => a !== null) as string[];
                            obj.multi_majors = (JSON.parse(obj.multi_majors_raw) as (string | null)[]).filter(a => a !== null) as string[];
                            obj.time_place = (JSON.parse(obj.time_place_raw) as (SubjectLectureRoomTimeDB)[]).filter(a => a.place !== null) as SubjectLectureRoomTimeDB[]; // raw field can be nullable.
                        }

                        r(row);
                    });
            });
        },
        major_lists: async (a: QueryMajor_ListsArgs) => {
            let queryInfos: ([string, any[]])[] = [];

            queryInfos.push(["(subject_major.year == (?))", [a.year]]);
            queryInfos.push(["(subject_major.semester == (?))", [a.semester]]);

            return await new Promise(r => {
                db.all(`
                            select distinct subject_major.isu_name, subject_major.is_main
                            from subject_major
                            where ${buildQuery(queryInfos)}
                            order by subject_major.isu_name;
                    `,
                    ([queryInfos].map<any[][]>(a => a.map(b => b[1]).flat())).flat(),
                    (err, row: SubjectMajorDB[]) => {
                        r(row);
                    });
            });
        },
        multi_major_lists: async (a: QueryMulti_Major_ListsArgs) => {
            let queryInfos: ([string, any[]])[] = [];

            queryInfos.push(["(subject_multi_major.year == (?))", [a.year]]);
            queryInfos.push(["(subject_multi_major.semester == (?))", [a.semester]]);

            return await new Promise(r => {
                db.all(`
                            select distinct subject_multi_major.univ, subject_multi_major.department, subject_multi_major.detail_department, subject_multi_major.isu_name
                            from subject_multi_major
                            where ${buildQuery(queryInfos)}
                            order by subject_multi_major.univ, subject_multi_major.department, subject_multi_major.detail_department, subject_multi_major.isu_name;
                    `,
                    ([queryInfos].map<any[][]>(a => a.map(b => b[1]).flat())).flat(),
                    (err, row: SubjectMultiMajorDB[]) => {
                        r(row);
                    });
            });
        },
        credits: async (a: QueryCreditsArgs) => {
            let queryInfos: ([string, any[]])[] = [];

            queryInfos.push(["(subject.year == (?))", [a.year]]);
            queryInfos.push(["(subject.semester == (?))", [a.semester]]);

            return await new Promise(r => {
                db.all(`
                            select distinct subject.credit
                            from subject
                            where ${buildQuery(queryInfos)}
                            order by subject.credit;
                    `,
                    ([queryInfos].map<any[][]>(a => a.map(b => b[1]).flat())).flat(),
                    (err, row: CreditDB[]) => {
                        r(row.map(({credit}) => credit));
                    });
            });
        },
        lecture_room_timetable: async (a: QueryLecture_Room_TimetableArgs) => {
            let queryInfos: ([string, any[]])[] = [];

            queryInfos.push(["(time_place.year == (?))", [a.year]]);
            queryInfos.push(["(time_place.semester == (?))", [a.semester]]);
            queryInfos.push(buildString("time_place.place", a.place));

            return await new Promise(r => {
                db.all(`
                            select time_place.place,
                                   json_group_array(json_object(
                                           'code',
                                           time_place.code,
                                           'day',
                                           time_place.day,
                                           'time_start',
                                           time_place.time_start,
                                           'time_end',
                                           time_place.time_end
                                                    )) as value_raw
                            from time_place
                            where ${buildQuery(queryInfos)}
                            group by time_place.place;
                    `,
                    ([queryInfos].map<any[][]>(a => a.map(b => b[1]).flat())).flat(),
                    (err, row: LectureRoomTimeTableDB[]) => {
                        r(row.map(a => ({...a, value: JSON.parse(a.value_raw)})));
                    });
            });
        },
        lecture_rooms: async (a: QueryLecture_RoomsArgs) => {
            let queryInfos: ([string, any[]])[] = [];

            queryInfos.push(["(time_place.year == (?))", [a.year]]);
            queryInfos.push(["(time_place.semester == (?))", [a.semester]]);

            return await new Promise(r => {
                db.all(`
                            select distinct time_place.place
                            from time_place
                            where ${buildQuery(queryInfos)}
                              and time_place.place IS NOT NULL
                            order by time_place.place;
                    `,
                    ([queryInfos].map<any[][]>(a => a.map(b => b[1]).flat())).flat(),
                    (err, row: LectureRoomDB[]) => {
                        r(row.map(a => a.place));
                    });
            });
        },
    };
};
