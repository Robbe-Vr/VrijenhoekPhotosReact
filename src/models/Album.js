import Group from "./Group";
import Photo from "./Photo";
import User from "./User";

export default class Album
{
    constructor(id, name, creationDate, iconPhoto, tags, photos, groups, user)
    {
        this.Id = id || 0;
        this.Name = name || "";
        this.CreationDate = creationDate ? new Date(creationDate) : null;
        this.IconPhoto = iconPhoto || new Photo();
        this.Tags = tags || [];
        this.Photos = photos || [];
        this.Groups = groups || [];
        this.UserId = user?.Id || "";
        this.User = user || new User();
    }

    Id = 0;
    Name = "";
    CreationDate;
    IconPhoto;
    Tags = [];
    Photos = [];
    Groups = [];
    UserId = "";
    User;
}