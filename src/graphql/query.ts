import {Database} from "sqlite3";
import {RootResolver} from "@hono/graphql-server";
import {Context} from "hono";
import {SubjectDB} from "../types/db";
import {MajorListQuery, SubjectQuery} from "../types/graphql";

import {buildBoolean, buildInt, buildIntRange, buildQuery, buildString, buildStringIncluded} from "./buildQuery";

export default (db: Database): RootResolver => (ctx?: Context) => {
    return {
        subject: async (a: SubjectQuery) => {
            let subjectQueryInfos: ([string, any[]])[] = [];

            subjectQueryInfos.push(["(subject.year == (?))", [a.year]]);
            subjectQueryInfos.push(["(subject.semester == (?))", [a.semester]]);

            subjectQueryInfos.push(buildString("subject.grade_rule", a.grade_rule));
            subjectQueryInfos.push(buildString("subject.grade_scale", a.grade_scale));
            subjectQueryInfos.push(buildString("subject.lang", a.lang));

            subjectQueryInfos.push(buildBoolean("subject.is_el", a.is_el));
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
                            select subject.*, json_group_array(distinct subject_multi_major.isu_name) as multi_majors_raw, json_group_array(distinct subject_major.isu_name) as majors_raw
                            from subject
                                     left join subject_multi_major on subject.year = subject_multi_major.year and subject.semester = subject_multi_major.semester and subject.code = subject_multi_major.code
                                     left join subject_major on subject.year = subject_major.year and subject.semester = subject_major.semester and subject.code = subject_major.code
                            where ${buildQuery(subjectQueryInfos)}
                              and ${a.multi_majors ? `(subject.code in (select subject_multi_major.code
                                                    from subject_multi_major
                                                    where ${buildQuery(multiMajorQueryInfos)}))` : "TRUE"}
                              and ${a.majors ? ` (subject.code in (select subject_major.code
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
                        }
                        r(row);
                    });
            });
        },
        major_lists: async (a: MajorListQuery) => {
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
                    (err, row: SubjectDB[]) => {
                        r(row);
                    });
            });
        },
        multi_major_lists: async (a: MajorListQuery) => {
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
                    (err, row: SubjectDB[]) => {
                        r(row);
                    });
            });
        },
    };
};
