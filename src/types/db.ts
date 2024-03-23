import {GradeRule, GradeScale, Language, Semester, SubjectProcess} from "./graphql";

interface SubjectDB {
    year: number,
    semester: keyof Semester,
    grade_scale: keyof GradeScale,

    grade_rule: keyof GradeRule,
    lang: keyof Language,
    process: keyof SubjectProcess,

    is_el: number,
    limited_target: number,

    syllabus: string | null,
    code: string,
    name: string,
    bunban: string | null,
    professor: string | null,
    open_department: string | null,
    credit: number,
    listen_count: number,
    remain_count: number,
    target: string | null,

    majors: string[],
    multi_majors: string[],
    time_place: TimePlaceDB_Subject[],

    majors_raw: string,
    multi_majors_raw: string,
    time_place_raw: string,
}

interface TimePlaceDB_Subject {
    place: string,
    day: string,
    time_start: string,
    time_end: string,
}

interface TimePlaceDB {
    year: number,
    semester: string,
    code: string,

    place: string,
    day: string,
    time_start: string,
    time_end: string
}

interface SubjectMajorDB {
    isu_name: string,
    is_main: number
}

interface SubjectMultiMajorDB {
    univ: string,
    department: string,
    detail_department: string,
    isu_name: string
}

export type {SubjectDB, TimePlaceDB, SubjectMajorDB, SubjectMultiMajorDB, TimePlaceDB_Subject};
