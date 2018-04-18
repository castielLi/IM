
import LocalizedStrings from 'react-native-localization';

let Strings = new LocalizedStrings({
    "en-US": {
        mainTab:{
            Chat:'Chat',
            Contacts:"Contacts",
            Discovery:"Discovery",
            Me:"Me"
        }
    },
    "zh-Hans-CN":{
        mainTab:{
            Chat:'云信',
            Contacts:"通讯录",
            Discovery:"发现",
            Me:"我"
        }
    }
})

export default Strings;