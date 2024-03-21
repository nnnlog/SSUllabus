enum Semester {
    first = "1학기",
    summer = "여름학기",
    second = "2학기",
    winter = "겨울학기"
}

enum GradeScale {
    SCORE = "점수 100기준 입력",
    PF = "Pass/Fail 입력",
    unknown = ""
}

enum GradeRule {
    RELATIVE = "상대평가",
    ABSOLUTE = "절대평가",
    unknown = ""
}

enum Language {
    KOREAN = "한국어",
    ENGLISH = "영어",
    MIXED_ENGLISH_KOREAN = "영어-한국어혼합",
    NATION = "원어",
    MIXED_NATION_KOREAN = "원어-한국어혼합",
    unknown = ""
}

enum SubjectProcess {
    haksa = "학사과정",
    suksa = "석사과정",
    sukbak = "석박과정",
    unknown = ""
}

export default {Semester, GradeScale, GradeRule, Language, SubjectProcess};
