function initApp() {
    var api_key = 'e5af734599c82ef2bf3f4f18c48468e5',
        photoset_id = '72157603796761396',
        url = 'https://api.flickr.com/services/rest/?' +
            'method=flickr.photosets.getPhotos&' +
            '&photoset_id=' + photoset_id +
            '&extras=url_q&format=json&nojsoncallback=1' +
            '&api_key=' + api_key;

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data, status, xhr) {
            $('<h3>').text('by: ' + data.photoset.ownername).appendTo('header');

            createThumbnails(data);

            // events
            $('#previous').on('click', function() {
                var imageID = $('#mainPanel .image').attr('id'),
                    index = imageID.slice(5)-1;

                if (index == 0) {
                    index = data.photoset.photo.length-1;  // image1 => index = 0
                } else {
                    index-=1; 
                }

                show(data.photoset.photo, index);
            });
            
            $('#next').on('click', function() {
                var imageID = $('#mainPanel .image').attr('id'),
                    index = imageID.slice(5)-1;  // image1 => index = 0
    
                if (index<data.photoset.photo.length-1) {
                    index+=1; 
                } else {
                    index=0;
                }
                
                show(data.photoset.photo, index);
            });
            
            $('#thumbnailPanel').delegate('img', 'click', function(e) {
                var id = $(this).attr('id'),
                    index = id.slice(9)-1;  // thumbnail6 => index = 5
                
                displayImage(data.photoset.photo, index);
                displayInfo(data.photoset.photo, index);
                
                // highlight only the selected thumbnail
                $('.thumbnail').removeClass('highlighted');
                $(this).addClass('highlighted');
            });
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
}

function createThumbnails(data) {
    var photos = data.photoset.photo,
        len = photos.length;

    // add the thumbnails to the page
    for (var i=0; i<len; i++) {
        $('<img>').attr({
            'id': 'thumbnail' + (i+1),
            'src': photos[i].url_q,
            'title': photos[i].title
        })
        .addClass('thumbnail')
        .appendTo('#thumbnailPanel');
    }
    
    show(photos, 0);
}

function show(photos, index) {
    displayImage(photos, index);
    displayInfo(photos, index);
    $('.thumbnail').removeClass('highlighted');
    $('#thumbnail' + (index+1)).addClass('highlighted');
}

// display the corresponding photo when clicking in the thumbnail
function displayImage(photos, index) {
    $('#mainPanel .image').detach();
    
    $('<img>').attr({
            'id': 'image' + (index+1),
            'src': photos[index].url_q,
            'title': photos[index].title
        })
        .addClass('image')
        .appendTo('#mainPanel');
}

// display the corresponding title of the selected image
function displayInfo(photos, index) {
    var title = photos[index].title,
        htmlFragment = '<h3>' + title +'</h3>';
    
    $('#mainPanel .title').detach();

    $(htmlFragment)
        .addClass('title')
        .appendTo('#mainPanel');
}

$(function() {
    initApp();
});