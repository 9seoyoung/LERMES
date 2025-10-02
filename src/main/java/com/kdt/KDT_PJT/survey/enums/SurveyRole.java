package com.kdt.KDT_PJT.survey.enums;

public enum SurveyRole {

    SUPER_ADMIN {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canRespond(SurveyScope scope) { return false; } // 응답 안 함
        @Override public boolean canView(SurveyScope scope) { return true; }
    },
    TENANT_ADMIN {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canRespond(SurveyScope scope) { return false; }
        @Override public boolean canView(SurveyScope scope) { return true; }
    },
    EMPLOYEE {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.COHORT; }
        @Override public boolean canRespond(SurveyScope scope) { return false; }
        @Override public boolean canView(SurveyScope scope) { return true; }
    },
    INSTRUCTOR {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canRespond(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canView(SurveyScope scope) { return scope == SurveyScope.COHORT || scope == SurveyScope.INTERNAL; }
    },
    STUDENT {
        @Override public boolean canCreate(SurveyScope scope) { return scope == SurveyScope.INTERNAL; }
        @Override public boolean canRespond(SurveyScope scope) { return scope == SurveyScope.COHORT || scope == SurveyScope.INTERNAL; }
        @Override public boolean canView(SurveyScope scope) { return scope == SurveyScope.COHORT || scope == SurveyScope.INTERNAL; }
    };

    public abstract boolean canCreate(SurveyScope scope);
    public abstract boolean canRespond(SurveyScope scope);
    public abstract boolean canView(SurveyScope scope);

    // DB roleType(숫자) → Enum 변환
    public static SurveyRole fromCode(Long roleId) {
        return switch (roleId.intValue()) {
            case 1 -> SUPER_ADMIN;
            case 2 -> TENANT_ADMIN;
            case 3 -> EMPLOYEE;
            case 4 -> INSTRUCTOR;
            case 5 -> STUDENT;
            default -> throw new IllegalArgumentException("Unknown roleId: " + roleId);
        };
    }

}
