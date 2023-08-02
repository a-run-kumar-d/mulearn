export const roles = {
    ADMIN: "Admins",
    DISCORD_MODERATOR: "Discord Moderator",
    EX_OFFICIAL: "Ex Official",
    FELLOW: "Fellow",
    ZONAL_CAMPUS_LEAD: "Zonal Campus Lead",
    APPRAISER: "Appraiser",
    DISTRICT_CAMPUS_LEAD: "District Campus Lead",
    MENTOR: "Mentor",
    INTERN: "Intern",
    CAMPUS_LEAD: "Campus Lead",
    BOT_DEV: "Bot Dev",
    PRE_MEMBER: "Pre Member",
    SUSPEND: "Suspended",
    STUDENT: "Student",
    ENABLER: "Enabler",
    IG_FACILITATOR: "IG Facilitator",
    TECH_TEAM: "Tech Team",
    ASSOCIATE: "Associate"
} as const;

export type Role = (typeof roles)[keyof typeof roles];
