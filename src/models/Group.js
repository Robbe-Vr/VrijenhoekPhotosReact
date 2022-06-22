import Photo from "./Photo";
import User from "./User";

export default class Group
{
    constructor(id, name, creationDate, iconPhoto, creator, albums, users, invitedUsers, requestingUsers)
    {
        this.Id = id || 0;
        this.Name = name || "";
        this.CreationDate = creationDate ? new Date(creationDate) : null;
        this.IconPhoto = iconPhoto || new Photo();
        this.CreatorId = creator?.Id || "";
        this.Creator = creator || new User();
        this.Albums = albums || [];
        this.Users = users || [];
        this.InvitedUsers = invitedUsers || [];
        this.RequestingUsers = requestingUsers || [];
    }

    Id = 0;
    Name = "";
    CreationDate;
    IconPhoto;
    CreatorId = "";
    Creator;
    Albums = [];
    Users = [];
    InvitedUsers = [];
    RequestingUsers = [];
}