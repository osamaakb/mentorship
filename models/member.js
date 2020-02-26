class Member {
    constructor(json) {
        this.title = json.title;
        this.id = json.userID;
        this.description = json.description;
        this.country = json.country;
        this.city = json.city;
        this.endHour = json.end_time;
        this.startHour = json.start_time;
        this.tags = json.tags;
        this.socialIconLinks = json.social_links;
    }
}
