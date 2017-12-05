pdApp.service('CoverService', ['$http', function ($http) {

    /*
    Source: https://stackoverflow.com/a/39621112
    */
    function _arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    this.getCover = function(url) {
        return $http({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer'
        }).then(function (resp) {
            return _arrayBufferToBase64(resp.data);
        });
    };

}]);