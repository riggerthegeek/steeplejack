(function () {

    $(function () {

        attachCopyToClipboard();

    });

    function makeid (length) {

        if (length === undefined) {
            length = 5;
        }

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;

    }

    function attachCopyToClipboard () {

        $("pre code").each(function () {

            var content = $(this).text();

            //var button = '<a href="#" class="copyButton">Copy</a>';

            var id = makeid(8);

            var button = '<button id="' + id + '" data-clipboard-text="sad wanky clown" title="Copy">Copy</button>';

            $(this)
                .append(button)
                .click(function () {

                    console.log(document.getElementById(id));

                    var client = new ZeroClipboard(document.getElementById(id));

                    client.on("ready", function () {

                        console.log("ready");

                        client.on("aftercopy", function( event ) {

                            console.log("copied");

                        });

                    });

                    console.log(client);

                });

        });

    }

})(this);
