// interface Subject {
//     year: number,
//     semester: "FIRST" | "SUMMER" | "SECOND" | "WINTER",
//
//     grade_scale: "SCORE" | "PF" | "UNKNOWN",
//     grade_rule: "relative" | "absolute" | "UNKNOWN",
//     lang: "korean" | "english" | "mixed_english_korea" | "nation" | "mixed_nation_korean" | "UNKNOWN",
//     process: "haksa" | "suksa" | "sukbak" | "UNKNOWN",
//
//     is_el: boolean,
//     limited_target: boolean,
//     syllabus: string | null,
//     code: string,
//     name: string,
//     bunban: string | null,
//     professor: string | null,
//     open_department: string | null,
//     credit: number,
//     listen_count: number,
//     remain_count: number,
//     target: string | null,
//
//     lecture_time_place: {
//         day: string,
//         place: string,
//         time_start: string,
//         time_end: string,
//     },
//
//     isu_names: ({
//         isu_name: string,
//         is_main: boolean,
//     })[],
//
//     multi_major: ({
//         univ: string,
//         department: string,
//         detail_department: string,
//         isu_name: string,
//     })[],
// }

import {GradeRuleKey, GradeScaleKey, LanguageKey, SemesterKey, SubjectProcessKey} from "./enum";

interface SubjectQuery {
    year: number,
    semester: SemesterKey,

    grade_scale?: GradeScaleKey[],
    grade_rule?: GradeRuleKey[],
    lang?: LanguageKey[],

    is_el?: boolean,
    limited_target?: boolean,

    keyword?: string[],

    code?: string[],
    bunban?: string[],
    open_department?: string[],

    credit?: number[] | undefined,
    listen_count?: ({ min: number, max: number })[],
    remain_count?: ({ min: number, max: number })[],

    process?: SubjectProcessKey[],
    target?: string[],

    majors?: string[],
    multi_majors?: string[],
}

interface MajorListQuery {
    year: number,
    semester: number,
}

export type {SubjectQuery, MajorListQuery};
