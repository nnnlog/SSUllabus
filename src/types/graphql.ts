interface Subject {
    year: number,
    semester: "first" | "summer" | "second" | "winter",

    grade_scale: "score" | "pf" | "unknown",
    grade_rule: "relative" | "absolute" | "unknown",
    lang: "korean" | "english" | "mixed_english_korea" | "nation" | "mixed_nation_korean" | "unknown",
    process: "haksa" | "suksa" | "sukbak" | "unknown",

    is_el: boolean,
    limited_target: boolean,
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

    lecture_time_place: {
        day: string,
        place: string,
        time_start: string,
        time_end: string,
    },

    isu_names: ({
        isu_name: string,
        is_main: boolean,
    })[],

    multi_major: ({
        univ: string,
        department: string,
        detail_department: string,
        isu_name: string,
    })[],
}

interface SubjectQuery {
    year: number,
    semester: "first" | "summer" | "second" | "winter",

    grade_scale: ("score" | "pf" | "unknown")[] | undefined,
    grade_rule: ("relative" | "absolute" | "unknown")[] | undefined,
    lang: ("korean" | "english" | "mixed_english_korea" | "nation" | "mixed_nation_korean" | "unknown")[] | undefined,

    is_el: boolean | undefined,
    limited_target: boolean | undefined,

    keyword: string[] | undefined,

    bunban: string[] | undefined,
    open_department: string[] | undefined,

    credit: number[] | undefined,
    listen_count: ({ min: number, max: number })[] | undefined,
    remain_count: ({ min: number, max: number })[] | undefined,

    process: string[] | undefined,
    target: string[] | undefined,

    majors: string[] | undefined,
    multi_majors: string[] | undefined,
}

export type {Subject, SubjectQuery};
