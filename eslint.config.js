import eslintPlugin from "@light-tower-team/eslint-plugin";

const namingConventionRuleName = "@typescript-eslint/naming-convention";
const namingConventionRules = eslintPlugin.configs.default.find((config) => config.rules?.[namingConventionRuleName])
  ?.rules[namingConventionRuleName];

export default [
  ...eslintPlugin.configs.default,
  {
    rules: {
      [namingConventionRuleName]: [
        ...namingConventionRules.filter(
          (rule) => !rule.selector?.includes("typeLike") || !rule.format?.includes("PascalCase"),
        ),
        {
          selector: ["enumMember"],
          format: ["PascalCase"],
        },
      ],
    },
  },
];
