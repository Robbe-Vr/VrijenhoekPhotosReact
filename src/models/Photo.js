import User from "./User";
import Album from "./Album";

export default class Photo
{
    constructor(id, name, creationDate, isVideo, type, albums, user)
    {
        this.Id = id || 0;
        this.Name = name || "";
        this.CreationDate = new Date(creationDate || 0);
        this.IsVideo = isVideo || false;
        this.Type = type || "";
        this.Albums = albums || [];
        this.UserId = user?.Id || "";
        this.User = user || new User();
    }

    Id = 0;
    Name = "";
    CreationDate = new Date(0);
    IsVideo = false;
    Type = "";
    Albums = [];
    UserId = "";
    User;
}