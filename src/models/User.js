import Album from "./Album";
import Group from "./Group";

export default class User
{
    constructor(id, name, rights, albums, groups, ownedGroups, creationDate)
    {
        this.Id = id || "";
        this.Name = name || "";
        this.Rights = rights || 0;
        this.Albums = albums || [];
        this.Groups = groups || [];
        this.OwnedGroups = ownedGroups || [];
        this.CreationDate = creationDate || new Date();
    }

    Id = "";
    Name = "";
    Rights = 0;
    Albums = [];
    Groups = [];
    OwnedGroups = [];
    CreationDate = new Date;
}