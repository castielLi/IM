import Gender from "../../../Common/Enums/Gender";
export default class LoginUserInfoDto {
    constructor() {
        this.SessionToken = "";
        this.IMToken = "";
        this.Account = "";
        this.Nickname = "";
        this.Email = "";
        this.PhoneNumber = "";
        this.FamilyName = "";
        this.Gender = Gender.Unknown;
        this.HeadImagePath = "";
        this.HeadImageUrl = "";
        this.GivenName = "";
    }
}
//# sourceMappingURL=LoginUserInfoDto.js.map