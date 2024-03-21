export const buildQuery = (queryInfos: ([string, any[]])[]) => {
    return "(" + queryInfos.map(a => a[0]).join(" AND ") + ")";
}

export const buildString = (key: string, value: string[] | undefined): [string, string[]] => {
    if (value === undefined) return ["(TRUE)", []];
    return [`
            (${key} IN (${value.map(() => "(?)")}))
        `, value];
};

export const buildStringIncluded = (keys: string[], value: string[] | undefined): [string, string[]] => {
    if (value === undefined) return ["(TRUE)", []];
    return [
        "(" +
        keys.map(key => value.map(() => `(${key} LIKE '%' || ? || '%')`)).flat().join(" OR ") +
        ")",
        keys.map<string[]>(() => value).flat()];
};

export const buildBoolean = (key: string, value: boolean | undefined): [string, boolean[]] => {
    if (value === undefined) return ["(TRUE)", []];
    return [`
            (${key} == (?))
        `, [value]];
};

export const buildInt = (key: string, value: number[] | undefined): [string, number[]] => {
    if (value === undefined) return ["(TRUE)", []];
    return [`
            (${key} IN (${value.map(() => "(?)")}))
        `, value];
};

export const buildIntRange = (key: string, value: ({ min: number, max: number })[] | undefined): [string, number[]] => {
    if (value === undefined) return ["(TRUE)", []];
    return ["(" + value.map(() => `((?) <= ${key} AND ${key} <= (?))`).join(" OR ") + ")", value.map(({min, max}) => [min, max]).flat()];
};
