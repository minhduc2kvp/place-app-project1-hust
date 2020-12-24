let map, markers, markerCluster, selectPlace;
let list_places = [], list_sites = [];

const ICON_CLUSTER_PATH = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
const ICON_MARKER_PATH = "https://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png";


$(async function (){
    selectPlace = $('#select-place');
    onMapLoading();
    await getPlaces();
    setDataSelectPlace();
    await getSites(list_places[0]._id.$oid);
    markerSites();
    endMapLoading();
    selectPlaceOnChange();
});

async function getPlaces(){
    await ajaxGet('places')
        .then(rs => {
            if (rs.status === 200){
                list_places = rs.data.data;
            }else{
                console.log(rs);
            }
        }).catch(e => {
            console.log(e);
        });
}

function setDataSelectPlace(){
    let output = list_places.map((place, index) => {
        return `<option value="${index}">
                    ${place.name} ${place.vip ? '(VIP)' : ''}
                </option>`
    }).join('');
    selectPlace.html(output);
}

async function getSites(place_id){
    let rs = list_places.find((place, index) => {
        if(place._id.$oid === place_id){
            return true;
        }else{
            return false;
        }
    });
    if (rs.vip){
        await ajaxGet(`sites/vip/${place_id}`)
            .then(rs => {
                if (rs.status === 200){
                    list_sites = rs.data.data;
                }
            }).catch(e => {
                alertInfo(false, "You are not permission. You need login");
                console.log(e);
            });
    }else{
       await ajaxGet(`sites/${place_id}`)
            .then(rs => {
                if (rs.status === 200){
                    list_sites = rs.data.data;
                }else{
                    console.log(rs);
                }
            }).catch(e => {
                console.log(e);
            });
    }
}

function markerSites(){
    markers = list_sites.map((site) => {
        const markerImage = new google.maps.MarkerImage(ICON_MARKER_PATH, new google.maps.Size(24, 32));
        let marker = new google.maps.Marker({
           position: {lat: site.latitude, lng: site.longitude},
           icon: markerImage
        });
        let infoWindow = new google.maps.InfoWindow({
             content: `<h5>${site.name}</h5><p>${site.description}</p>`
        });
        marker.addListener('click', function (){
           infoWindow.open(map, marker);
        });
        return marker;
    });
    markerCluster = new MarkerClusterer(map, markers, {imagePath: ICON_CLUSTER_PATH});
}

function selectPlaceOnChange(){
    selectPlace.on('change', async function (){
       markerCluster.clearMarkers();
       onMapLoading();
       let place_id = list_places[selectPlace.val()]._id.$oid;
       await getSites(place_id);
       markerSites();
       endMapLoading();
    });
}

function onMapLoading(){
    $('#loading').removeClass('d-none');
}

function endMapLoading(){
    $('#loading').addClass('d-none');
}

function initMap(){
    const hanoi = {lat: 21.028511, lng: 105.804817};
    let options = {
        center : hanoi,
        zoom : 5
    }

    // New Map
    map = new google.maps.Map(document.getElementById("map"), options);
}