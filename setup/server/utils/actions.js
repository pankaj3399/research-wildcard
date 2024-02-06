const actions = {
    CREATE_PROJECT: "create_project",
    IMPORT_ARTICLES: "import_articles",
    UPDATE_ARTICLE_REVIEW_STATUS: "update_article_review_status",
    ASSIGN_ARTICLE_TO_REVIEWER: "assign_article_to_reviewer",
    UPDATE_REVIEW_STAGE_STATUS: "update_review_stage_status",
    ADD_COLLABORATOR: "add_collaborator",
    DELETE_PROJECT: "delete_project",
    CREATE_REVIEW_INSTANCE: "create_review_instance",
    UPDATE_REVIEW_STATUS: "update_review_status",
    AGGREGATE_REVIEW_RESULTS: "aggregate_review_results",
    VIEW_REVIEW_DETAILS: "view_review_details",
    CREATE_ROLE: "create_role",
    LIST_ROLES: "list_roles",
    GET_ROLE_DETAILS: "get_role_details",
    UPDATE_ROLE: "update_role",
    CREATE_TEAM: "create_team",
    ADD_MEMBER_TO_TEAM: "add_member_to_team",
    UPDATE_MEMBER_ROLE_IN_TEAM: "update_member_role_in_team",
    REMOVE_MEMBER_FROM_TEAM: "remove_member_from_team",
    UPDATE_TEAM: "update_team",
    ASSIGN_TEAM_TO_PROJECT: "assign_team_to_project",
    VIEW_TEAM_DETAILS: "view_team_details",
    CREATE_USER: "create_user",
    UPDATE_USER: "update_user",
    ASSIGN_ROLE_TO_USER: "assign_role_to_user",
    DELETE_USER: "delete_user",
    LIST_USERS: "list_users",
    ASSIGN_ROLE_TO_USER_PROJECT_TEAM: "assign_role_to_user_project_team",
    UPDATE_USER_ROLE: "update_user_role",
    REMOVE_ROLE_FROM_USER: "remove_role_from_user",
    LIST_USER_ROLES: "list_user_roles",
};

module.exports = actions;
