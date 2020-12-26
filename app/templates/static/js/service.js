

// GET ALL PLACES
async function getPlaces(){
    let list_places = [];
    await ajaxGet('places')
        .then(rs => {
            if (rs.status === 200){
                list_places = rs.data.data;
            }
        }).catch(e => {
            console.log(e);
        });
    return list_places;
}

// GET ALL SITES
async function getSites(){
    let list_sites = [];
    await ajaxGet(`sites`)
        .then(rs => {
            if (rs.status === 200){
                list_sites = rs.data.data;
            }
        }).catch(e => {
            console.log(e);
        });
    return list_sites;
}

// GET ALL SITES BY PLACE ID VIP
async function getSitesByPlaceId(place_id){
    let list_sites = [];
    await ajaxGet(`sites/vip/` + place_id)
        .then(rs => {
            if (rs.status === 200){
                list_sites = rs.data.data;
            }
        }).catch(e => {
            console.log(e);
        });
    return list_sites;
}

// GET ALL SITES BY PLACE ID NORMAL
async function getSitesByPlaceIdNormal(place_id){
    let list_sites = [];
    await ajaxGet(`sites/` + place_id)
        .then(rs => {
            if (rs.status === 200){
                list_sites = rs.data.data;
            }
        }).catch(e => {
            console.log(e);
        });
    return list_sites;
}