/**
 * Created by ml23 on 2017/07/24.
 */
/**
 * Created by buhe on 16/4/12.
 */
export default class ImageView {
    constructor(mode, width, height, quality, format) {
        this.mode = mode || 1;
        this.width = width || 0;
        this.height = height || 0;
        this.quality = quality || 0;
        this.format = format || null;
    }
    makeRequest(url) {
        url += '?imageView2/' + this.mode;
        if (this.width > 0) {
            url += '/w/' + this.width;
        }
        if (this.height > 0) {
            url += '/h/' + this.height;
        }
        if (this.quality > 0) {
            url += '/q/' + this.quality;
        }
        if (this.format) {
            url += '/format/' + this.format;
        }
        return url;
    }
}
export class ImageInfo {
    makeRequest(url) {
        return url + '?imageInfo';
    }
}
export class Exif {
    makeRequest(url) {
        return url + '?exif';
    }
}
//# sourceMappingURL=imageops.js.map