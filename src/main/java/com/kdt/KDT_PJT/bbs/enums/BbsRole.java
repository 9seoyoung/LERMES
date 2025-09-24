package com.kdt.KDT_PJT.bbs.enums;

public enum BbsRole {
    SUPER_ADMIN {
        @Override public boolean canCreate(BbsType type) { return true; }
        @Override public boolean canRead(BbsType type) { return true; }
        @Override public boolean canUpdate(BbsType type) { return true; }
        @Override public boolean canDelete(BbsType type) { return true; }
    },

    TENANT {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) { return true; }
        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE-> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE-> true;
                default -> false;
            };
        }
    },

    EMPLOYEE {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE -> true;
                default -> false;
            };
        }

        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case NOTICE, FAQ, QNA, PRIVATE -> true;
                default -> false;
            };
        }
    },

    INSTRUCTOR {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) { return true; }

        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA, PRIVATE -> true;
                default -> false;
            };
        }
    },

    STUDENT {
        @Override public boolean canCreate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canRead(BbsType type) { return true; }

        @Override public boolean canUpdate(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA, PRIVATE -> true;
                default -> false;
            };
        }
        @Override public boolean canDelete(BbsType type) {
            return switch (type) {
                case CLASS_MATERIAL, QNA, PRIVATE -> true;
                default -> false;
            };
        }
    },

    GENERAL {
        @Override public boolean canCreate(BbsType type) { return type == BbsType.QNA; }
        @Override public boolean canRead(BbsType type) { return type == BbsType.NOTICE; }
        @Override public boolean canUpdate(BbsType type) { return false; }
        @Override public boolean canDelete(BbsType type) { return false; }
    },

    VISITOR {
        @Override public boolean canCreate(BbsType type) { return false; } // 글 작성 불가
        @Override public boolean canRead(BbsType type) { return type == BbsType.NOTICE; } // 공지만 열람 가능
        @Override public boolean canUpdate(BbsType type) { return false; }
        @Override public boolean canDelete(BbsType type) { return false; }
    };

    // 공통 메서드
    public abstract boolean canCreate(BbsType type);
    public abstract boolean canRead(BbsType type);
    public abstract boolean canUpdate(BbsType type);
    public abstract boolean canDelete(BbsType type);

    // 👇 DB roleType(숫자) → Enum 변환 메서드
    public static BbsRole fromCode(Long roleId) {
        if (roleId == null) return VISITOR;
        return switch (roleId.intValue()) {
            case 1 -> SUPER_ADMIN;
            case 2 -> TENANT;
            case 3 -> EMPLOYEE;
            case 4 -> INSTRUCTOR;
            case 5 -> STUDENT;
            case 6 -> GENERAL;
            default -> VISITOR; // Unknown 안전 fallback
        };
    }
}
