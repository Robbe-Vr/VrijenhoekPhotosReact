import User from "./User";

export default class Tag
{
    constructor(id, name, creationDate, user)
    {
        this.Id = id || 0;
        this.Name = name || "";
        this.CreationDate = creationDate ? new Date(creationDate) : null;
        this.UserId = user?.Id || "";
        this.User = user || new User();
    }

    Id = 0;
    Name = "";
    CreationDate;
    UserId = "";
    User;
}