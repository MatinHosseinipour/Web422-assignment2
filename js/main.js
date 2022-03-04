/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Matin Hosseini Pour Student ID: 151267192 Date: feb 26th 2022
*
*
********************************************************************************/




var  restaurantData=[];//fetch
var currentRestaurant={} ;
var page=1;
const perPage=10;
var map=null;
function avg(grades){
  return _.meanBy(grades,'score').toFixed(2);
};
const tableRows =_.template(`
<% _.forEach(restaurants,function(restaurant){ %>
  <tr  data-id="<%= restaurant._id %>">
  <td> <%= restaurant.name %></td>
  <td> <%= restaurant.cuisine %> </td>
  <td>  <%= restaurant.address.building %> , <%= restaurant.address.street %></td>
  <td><%= avg(restaurant.grades) %></td>
  </tr>
  <%})%>
  `);
  
  
  // <%= restaurant.address.building %> , <%= restaurant.address.street %>
  
  function loadRestaurantData(){
    fetch(`https://secret-tundra-37490.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`,)
    .then(response => response.json())
    .then(function(data){
      
      //  console.log(data);
      restaurantData=data;
      var restaurantsTbody=tableRows({restaurants:data});
      //  console.log(restaurantsTbody);
      $("#restaurants tbody").html(restaurantsTbody);
      $("#current-page a").html(page);     
    })
    
    
  }

  
  
  $(document).ready(function(){
    loadRestaurantData();
    $("#restaurants").on("click"," tbody tr",function(){
      let restaurant_id=($(this).data("id"));
      currentRestaurant=restaurantData.find(function(element){
        return (element._id == restaurant_id);
      })
      $("#restaurant-modal .modal-title").text(currentRestaurant.name);
      //  console.log($("#restaurant-modal #restaurant-address"));
      $("#restaurant-modal #restaurant-address").text(currentRestaurant.address.building+ ", " +currentRestaurant.address.street);
      $('#restaurant-modal').modal("show");       
    });
    
    $("#previous-page ").on("click",function(){
      // console.log("helloo");
      if (page>1){
        page--;
        loadRestaurantData();
      }
    })
    
    
    $("#next-page ").on("click",function(){
      page++;
      loadRestaurantData();
    })
    
    //show map
    $('#restaurant-modal').on('shown.bs.modal', function () {
      
      var map = L.map('leaflet').setView([currentRestaurant.address.coord[1],currentRestaurant.address.coord[0]], 18);
      
      
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([currentRestaurant.address.coord[1],currentRestaurant.address.coord[0]]).addTo(map)
    
  });
  
  
  //hidden map
  
  $('#restaurant-modal').on('hidden.bs.modal', function () {
    map.remove();       
  });
  
})



