import axios from "axios";
import Album from "../models/Album";
import Group from "../models/Group";
import Photo from "../models/Photo";
import Tag from "../models/Tag";
import User from "../models/User";

const A_TOKEN_LS = "vrijenhoekphotos_data2";
function getAccessToken() {
    var token = localStorage.getItem(A_TOKEN_LS);

    return token;
};

function getHeaders()
{
    return {
        "VrijenhoekPhotos_AccessToken": getAccessToken(),
        "Content-Type": "application/json",
    }
}

function HandlerError(error) {
    if (error.response) {
        if (error.response.data instanceof String || typeof error.response.data == 'string') {
            if (error.response.data.indexOf('Unknown access_token') > -1) {
                localStorage.setItem("vrijenhoekphotos_data1", null);
                localStorage.setItem(A_TOKEN_LS, null);
                localStorage.setItem("vrijenhoekphotos_data3", null);
                window.location.href = '/signin/login';
                return null;
            } else {
                console.log(`Server responded: ${error.response.data}`, error.response);
            }
        }
        else {
            console.log(`Server responded: ${error.response.status} - ` + error.response.data.message, error.response);
        }
    } else if (error.request) {
        console.log(`Request failed: `, error.request);
    } else {
        console.log(`Axios request execution fail: ${error.message}`, error);
    }

    return error.response?.data ?? "Unknown Error";
};

export default class Api
{
    constructor()
    {
        this.ServerUrl = 'https://photosapi.sywapps.com';
        this.ApiUrl = this.ServerUrl + '/api';
        this.RefreshTokenName = "VrijenhoekPhotos_RefreshToken";
        this.AccessTokenHeaderName = "VrijenhoekPhotos_AccessToken";

        this.ImageBaseUrl = this.ApiUrl + "/photos/image/";
        this.ThumbnailBaseUrl = this.ApiUrl + "/photos/thumbnail/";
    }

    // Authorization
    async ValidateAccessToken(authToken)
    {
        try
        {
            const data = JSON.stringify(authToken, null, 4);

            var res = await axios.post(this.ApiUrl + '/authorize/validate', data, { headers: getHeaders() });

            return res.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RefreshAccessToken(authToken)
    {
        try
        {
            const data = JSON.stringify(authToken, null, 4);

            var res = await axios.post(this.ApiUrl + '/authorize/refresh', data, { headers: getHeaders() });

            return res.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async Logout()
    {
        try
        {
            var res = await axios.post(this.ApiUrl + '/authorize/logout', null, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async Login(loginInfo)
    {
        try
        {
            const data = JSON.stringify(loginInfo, null, 4);

            var res = await axios.post(this.ApiUrl + '/authorize/login', data, { headers: { "Content-Type": "application/json" } });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async Register(registerInfo)
    {
        try
        {
            const data = JSON.stringify(registerInfo, null, 4);

            var res = await axios.post(this.ApiUrl + '/authorize/register', data, { headers: { "Content-Type": "application/json" } });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async FindUser(userNameOrEmail)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/accounts/find/' + userNameOrEmail, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async SendResetPasswordEmail(userNameOrEmail)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/accounts/resetpassword/' + userNameOrEmail, { headers: { "Content-Type": "application/json" } });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async ResetPassword(newUser, resetToken)
    {
        try
        {
            const data = JSON.stringify(newUser, null, 4);

            var res = await axios.post(this.ApiUrl + '/accounts/resetpassword?resetToken=' + resetToken, data, { headers: { "Content-Type": "application/json" } });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async UpdateUserName(userName, userId = null)
    {
        try
        {
            const data = JSON.stringify({ UserName: userName }, null, 4);

            var res = await axios.post(this.ApiUrl + '/accounts/update' + (userId instanceof String || typeof userId == 'string' ? '/' + userId : ''), data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    // CRUD Groups
    async CreateGroup(group)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/create/' + group, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersOwnedGroups(page = null, rpp = null, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/owned' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var groups = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(group =>
                new Group(group.id, group.groupName, group.creationDate,
                    group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [],
                        new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                    ) : new Photo(group.iconPhotoId),
                    new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creator.creationDate),
                    Array.isArray(group.albums) ? group.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(group.users) ? group.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    Array.isArray(group.pendingJoinUsers) ? group.pendingJoinUsers.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    Array.isArray(group.requestedJoinUsers) ? group.requestedJoinUsers.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : []
                )
            ) : [];

            return groups;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersOwnedGroupsCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/owned/count', { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersJoinedGroups(page = null, rpp = null, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/joined' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var groups = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(group =>
                new Group(group.id, group.groupName, group.creationDate,
                    group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [],
                        new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                    ) : null,
                    new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creator.creationDate),
                    Array.isArray(group.albums) ? group.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(group.users) ? group.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    [], []
                )
            ) : [];

            return groups;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersJoinedGroupsCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/joined/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersGroups(page = null, rpp = null, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var groups = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(group =>
                new Group(group.id, group.groupName, group.creationDate,
                    group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [],
                        new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                    ) : null,
                    new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creator.creationDate),
                    Array.isArray(group.albums) ? group.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(group.users) ? group.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    [], []
                )
            ) : [];

            return groups;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersGroupsCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetAlbumsFromGroup(groupId, page, rpp, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/' + groupId + '/albums' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var albums = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(album =>
                new Album(album.id, album.name, album.creationDate,
                    album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [], 
                        album.iconPhoto.user ? new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate) : new User(album.iconPhoto.userId)
                    ) : null,
                    Array.isArray(album.tags) ? album.tags.map((tag) => {
                        return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                    })
                    : [],
                    Array.isArray(album.photos) ? album.photos.map((photo) => {
                        return new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type, [], 
                            photo.user ? new User(photo.userId, photo.user.userName, photo.user.rights, [], [], [], photo.user.creationDate) : new User(photo.userId)
                        );
                    })
                    : [],
                    Array.isArray(album.groups) ? album.groups.map((group) => {
                        return new Group(group.id, group.groupName, group.creationDate,
                            group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [], 
                                group.iconPhoto ? new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate) : new User(group.iconPhoto.userId)
                            ) : group.iconPhotoId ? new Photo(group.iconPhotoId) : null,
                            group.creator ? new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creationDate) : new User(group.creatorId),
                            Array.isArray(group.users) ? group.users.map((user) => {
                                return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                            }) : []
                        );
                    }) : [],
                    album.user ? new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate) : new User(album.userId)
                )
            ) : [];

            return albums;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetAlbumsFromGroupCount(groupId, nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/' + groupId + '/albums/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async SeekGroups(filter = '', page = null, rpp = null, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/seek?filter=' + encodeURIComponent(filter instanceof String || typeof filter == 'string' ? filter : '<empty>') + (Number.isInteger(page) ? '&page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var groups = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(group =>
                new Group(group.id, group.groupName, group.creationDate,
                    group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [],
                        new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                    ) : null,
                    new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creator.creationDate),
                    Array.isArray(group.albums) ? group.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(group.users) ? group.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    [], []
                )
            ) : [];

            return groups;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetSeekGroupsCount(filter = '')
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/seek/count?filter=' + encodeURIComponent(filter instanceof String || typeof filter == 'string' ? filter : '<empty>'), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetGroup(groupId)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/groups/' + groupId, { headers: getHeaders() });

            var item = res.data;
            var group = item ?
                new Group(item.id, item.groupName, item.creationDate,
                    item.iconPhoto ? new Photo(item.iconPhotoId, item.iconPhoto.name, item.iconPhoto.creationDate, item.iconPhoto.isVideo, item.iconPhoto.type, [],
                        new User(item.iconPhoto.userId, item.iconPhoto.user.userName, item.iconPhoto.user.rights, [], [], [], item.iconPhoto.user.creationDate)
                    ) : null,
                    new User(item.creatorId, item.creator.userName, item.creator.rights, [], [], [], item.creator.creationDate),
                    Array.isArray(item.albums) ? item.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(item.users) ? item.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    [], []
                ) : null;

            return group;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetGroupJoinRequests(nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/accounts/join-requests' + (nameFilter ? '?namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : ''), { headers: getHeaders() });

            var groups = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(group =>
                new Group(group.id, group.groupName, group.creationDate,
                    group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [],
                        new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                    ) : null,
                    new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creator.creationDate),
                    Array.isArray(group.albums) ? group.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(group.users) ? group.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    [], []
                )
            ) : [];

            return groups;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RequestToJoinGroup(groupId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/request-join/' + groupId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async AcceptJoinRequest(groupId, userId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/accept-request/' + userId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }


    async DeclineJoinRequest(groupId, userId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/decline-request/' + userId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetGroupInvites(nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/accounts/group-invites' + (nameFilter ? '?namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : ''), { headers: getHeaders() });

            var groups = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(group =>
                new Group(group.id, group.groupName, group.creationDate,
                    group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [],
                        new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                    ) : null,
                    new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creator.creationDate),
                    Array.isArray(group.albums) ? group.albums.map((album) => {
                        return new Album(album.id, album.name, album.creationDate,
                            album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                            ) : album.iconPhotoId ? new Photo(album.iconPhotoId) : null,
                            Array.isArray(album.tags) ? album.tags.map((tag) => {
                                return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                            })
                            : [],
                            [], [],
                            new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                        );
                    }) : [],
                    Array.isArray(group.users) ? group.users.map((user) => {
                        return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                    }) : [],
                    [], []
                )
            ) : [];

            return groups;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async InviteToJoinGroup(groupId, userId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/invite/' + userId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async AcceptInvite(groupId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/accept-invite', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async DeclineInvite(groupId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/decline-invite', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemoveUserFromGroup(groupId, userId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/removeuser/' + userId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async AddAlbumToGroup(groupId, albumId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/add/' + albumId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemoveAlbumFromGroup(albumId, groupId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/' + groupId + '/remove/' + albumId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async UpdateGroup(Group)
    {
        try
        {
            const data = JSON.stringify(Group, null, 4);

            var res = await axios.post(this.ApiUrl + '/groups/update', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemoveGroup(Group)
    {
        try
        {
            const data = JSON.stringify(Group, null, 4);

            var res = await axios.post(this.ApiUrl + '/Groups/remove', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    // CRUD Albums
    async CreateAlbum(album)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/create/' + album, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersAlbums(page = null, rpp = null, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var albums = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(album =>
                new Album(album.id, album.name, album.creationDate,
                    album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [], 
                        new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                    ) : null,
                    Array.isArray(album.tags) ? album.tags.map((tag) => {
                        return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                    })
                    : [],
                    Array.isArray(album.photos) ? album.photos.map((photo) => {
                        return new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type, [], 
                            new User(photo.userId, photo.user.userName, photo.user.rights, [], [], [], photo.user.creationDate)
                        );
                    })
                    : [],
                    Array.isArray(album.groups) ? album.groups.map((group) => {
                        return new Group(group.id, group.groupName, group.creationDate,
                            group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [], 
                                new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                            ) : group.iconPhotoId ? new Photo(group.iconPhotoId) : null,
                            new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creationDate),
                            Array.isArray(group.users) ? group.users.map((user) => {
                                return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                            }) : []
                        );
                    }) : [],
                    new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                )
            ) : [];

            return albums;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersAlbumsCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersOwnedAlbums(page = null, rpp = null, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/owned' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var albums = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(album =>
                new Album(album.id, album.name, album.creationDate,
                    album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [], 
                        new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                    ) : null,
                    Array.isArray(album.tags) ? album.tags.map((tag) => {
                        return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                    })
                    : [],
                    Array.isArray(album.photos) ? album.photos.map((photo) => {
                        return new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type, [], 
                            new User(photo.userId, photo.user.userName, photo.user.rights, [], [], [], photo.user.creationDate)
                        );
                    })
                    : [],
                    Array.isArray(album.groups) ? album.groups.map((group) => {
                        return new Group(group.id, group.groupName, group.creationDate,
                            group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [], 
                                new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                            ) : group.iconPhotoId ? new Photo(group.iconPhotoId) : null,
                            new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creationDate),
                            Array.isArray(group.users) ? group.users.map((user) => {
                                return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                            }) : []
                        );
                    }) : [],
                    new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                )
            ) : [];

            return albums;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersOwnedAlbumsCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/owned/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersJoinedAlbums(page = null, rpp = null, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/joined' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var albums = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(album =>
                new Album(album.id, album.name, album.creationDate,
                    album.iconPhoto ? new Photo(album.iconPhotoId, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [], 
                        new User(album.iconPhoto.userId, album.iconPhoto.user.userName, album.iconPhoto.user.rights, [], [], [], album.iconPhoto.user.creationDate)
                    ) : null,
                    Array.isArray(album.tags) ? album.tags.map((tag) => {
                        return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                    })
                    : [],
                    Array.isArray(album.photos) ? album.photos.map((photo) => {
                        return new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type, [], 
                            new User(photo.user.Id, photo.user.userName, photo.user.rights, [], [], [], photo.user.creationDate)
                        );
                    })
                    : [],
                    Array.isArray(album.groups) ? album.groups.map((group) => {
                        return new Group(group.id, group.groupName, group.creationDate,
                            group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [], 
                                new User(group.iconPhoto.userId, group.iconPhoto.user.userName, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)
                            ) : group.iconPhotoId ? new Photo(group.iconPhotoId) : null,
                            new User(group.creatorId, group.creator.userName, group.creator.rights, [], [], [], group.creationDate),
                            Array.isArray(group.users) ? group.users.map((user) => {
                                return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                            }) : []
                        );
                    }) : [],
                    new User(album.userId, album.user.userName, album.user.rights, [], [], [], album.user.creationDate)
                )
            ) : [];

            return albums;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersJoinedAlbumsCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/joined/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetPhotosFromAlbum(albumId, page, rpp, nameFilter, sorting)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/' + albumId + '/photos' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var photos = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(photo =>
                new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type,
                    Array.isArray(photo.albums) ? photo.albums.map((album) => 
                        new Album(album.id, album.name, album.creationDate,
                            new Photo(),
                            [], [], [],
                            album.user ? new User(album.userId, album.user.userName, false, [], [], [], new Date(album.user.creationDate)) : new User(album.userId)
                        )
                    )
                    : [],
                    photo.user ? new User(photo.userId, photo.user.userName, false, [], [], [], photo.user.creationDate) : new User(photo.userId)
                )
            ) : [];

            return photos;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetPhotosFromAlbumCount(albumId, nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/' + albumId + '/photos/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetAlbum(albumId)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/albums/' + albumId, { headers: getHeaders() });

            var item = res.data;
            var album = item ?
                new Album(item.id, item.name, item.creationDate,
                    item.iconPhoto ? new Photo(item.iconPhotoId, item.iconPhoto.name, item.iconPhoto.creationDate, item.iconPhoto.isVideo, item.iconPhoto.type, [], 
                        new User(item.iconPhoto.userId, item.iconPhoto.user.userName, item.iconPhoto.user.rights, [], [], [], item.iconPhoto.user.creationDate)
                    ) : null,
                    Array.isArray(item.tags) ? item.tags.map((tag) => {
                        return new Tag(tag.id, tag.name, tag.creationDate, new User(tag.userId));
                    })
                    : [],
                    Array.isArray(item.photos) ? item.photos.map((photo) => {
                        return new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type, [], 
                            new User(photo.userId, photo.user.userName, photo.user.rights, [], [], [], photo.user.creationDate)
                        );
                    })
                    : [],
                    Array.isArray(item.groups) ? item.groups.map((group) => {
                        return new Group(group.id, group.groupName, group.creationDate,
                            group.iconPhoto ? new Photo(group.iconPhotoId, group.iconPhoto.name, group.iconPhoto.creationDate, group.iconPhoto.isVideo, group.iconPhoto.type, [], 
                                new User(group.iconPhoto.userId, group.iconPhoto.user.name, group.iconPhoto.user.rights, [], [], [], group.iconPhoto.user.creationDate)    
                            ) : group.iconPhotoId ? new Photo(group.iconPhotoId) : null,
                            new User(group.creatorId, group.creator.name, group.creator.rights, [], [], [], group.creationDate),
                            Array.isArray(group.users) ? group.users.map((user) => {
                                return new User(user.id, user.userName, user.rights, [], [], [], user.creationDate);
                            }) : []
                        );
                    }) : [],
                    new User(item.userId, item.user.userName, item.user.rights, [], [], [], item.user.creationDate)
                ) : null;

            return album;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async AddTagToAlbum(tag, albumId)
    {
        try
        {
            const data = JSON.stringify(tag, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/' + albumId + '/addtag', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemoveTagFromAlbum(tagId, albumId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/' + albumId + '/removetag/' + tagId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async AddPhotoToAlbum(photoId, albumId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/' + albumId + '/add/' + photoId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemovePhotoFromAlbum(photoId, albumId)
    {
        try
        {
            const data = JSON.stringify({}, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/' + albumId + '/remove/' + photoId, data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async UpdateAlbum(album)
    {
        try
        {
            const data = JSON.stringify(album, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/update', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemoveAlbum(album)
    {
        try
        {
            const data = JSON.stringify(album, null, 4);

            var res = await axios.post(this.ApiUrl + '/albums/remove', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    // CRUD Photos(/videos)
    async UploadImage(uploadData)
    {
        try
        {
            var res = await axios.post(this.ApiUrl + '/upload', uploadData, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersPhotos(page = null, rpp = null, nameFilter = null, sorting = 2)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/photos' + (Number.isInteger(page) ? '?page=' + page + (Number.isInteger(rpp) ? '&rpp=' + rpp : '') + (nameFilter ? '&namefilter=' + nameFilter : '') + (sorting > -1 ? '&sorting=' + sorting : '') : ''), { headers: getHeaders() });

            var photos = res.data && res.data.map && Array.isArray(res.data) ? res.data.map(photo =>
                new Photo(photo.id, photo.name, photo.creationDate, photo.isVideo, photo.type,
                    Array.isArray(photo.albums) ? photo.albums.map((album) => 
                        new Album(album.id, album.name, album.creationDate,
                            new Photo(),
                            [], [], [],
                            new User(album.userId, album.user.userName, false, [], [], [], new Date(album.user.creationDate))
                        )
                    )
                    : [],
                    new User(photo.userId, photo.user.userName, false, [], [], [], photo.user.creationDate)
                )
            ) : [];

            return photos;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetUsersPhotosCount(nameFilter)
    {
        try
        {
            var res = await axios.get(this.ApiUrl + '/photos/count' + (nameFilter ? '?namefilter=' + nameFilter : ''), { headers: getHeaders() });

            return parseInt(res.data) ?? 0;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async UpdatePhoto(photo)
    {
        try
        {
            const data = JSON.stringify(photo, null, 4);

            var res = await axios.post(this.ApiUrl + '/photos/update', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async RemovePhoto(photo)
    {
        try
        {
            const data = JSON.stringify(photo, null, 4);

            var res = await axios.post(this.ApiUrl + '/photos/remove', data, { headers: getHeaders() });

            return res;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    // get content
    GetContentStreamUrl(id)
    {
        return this.ApiUrl + '/photos/webcontent/' + id + '?' + this.AccessTokenHeaderName + '=' + getAccessToken();
    }

    async GetImage(id)
    {
        try
        {
            var data = await axios.get(this.ApiUrl + '/photos/content/' + id, { headers: getHeaders(), responseType: 'arraybuffer' })
                .then(res => { return { base64: Buffer.from(res.data, 'binary').toString('base64'), type: res.headers["content-type"] }; });

            return data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }

    async GetThumbnail(id)
    {
        try
        {
            var data = await axios.get(this.ApiUrl + '/photos/thumbnail/' + id, { headers: getHeaders(), responseType: 'arraybuffer' })
                .then(res => { return { base64: Buffer.from(res.data, 'binary').toString('base64'), type: res.headers["content-type"] }; });

            return data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    }
}