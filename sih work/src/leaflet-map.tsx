'use client';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, CircleMarker, useMap } from 'react-leaflet';
import { routePaths, waterZones, trafficZones, potholes, pedestrianZones, type Bus, type Incident } from './data';

function busIcon(status:Bus['status'],occupancy:number){
 const tone=occupancy>=.85?'orange':status==='On time'?'green':status==='Delayed'?'amber':'red';
 return L.divIcon({className:'leaflet-bus-icon',html:`<span class="leaflet-bus-pin ${tone}">▰</span>`,iconSize:[24,24],iconAnchor:[12,12]});
}
function MapControls(){const map=useMap();return <div className="leaflet-quick-controls"><button aria-label="Zoom in" onClick={()=>map.zoomIn()}>+</button><button aria-label="Zoom out" onClick={()=>map.zoomOut()}>−</button><button aria-label="Locate network" onClick={()=>map.setView([28.6139,77.209],14)}>◎</button></div>}
const stopIcon=L.divIcon({className:'leaflet-stop-icon',html:'<span></span>',iconSize:[10,10],iconAnchor:[5,5]});
const stops:[string,[number,number]][]=[['Central Transit Hub',[28.6139,77.209]],['Civic Center',[28.623,77.207]],['Museum Quarter',[28.609,77.217]],['University Avenue',[28.625,77.195]],['Riverside Market',[28.604,77.228]],['North Terminal',[28.634,77.205]],['City Mall',[28.608,77.196]],['Market Street',[28.617,77.221]]];
export default function LeafletFleetMap({buses,incidents=[],showBuses=true,showRoutes=true,showStops=true,showTraffic=true,showWater=true,showPotholes=true,showPedestrian=true,showIncidents=true,showDensity=true}:{buses:Bus[];incidents?:Incident[];showBuses?:boolean;showRoutes?:boolean;showStops?:boolean;showTraffic?:boolean;showWater?:boolean;showPotholes?:boolean;showPedestrian?:boolean;showIncidents?:boolean;showDensity?:boolean}){
 return <MapContainer center={[28.6139,77.209]} zoom={13} scrollWheelZoom zoomControl className="leaflet-map">
  <MapControls/>
  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19}/>
  {showRoutes&&Object.entries(routePaths).map(([route,path],i)=><Polyline key={route} positions={path} pathOptions={{color:['#20aa9e','#7769d7','#408db2','#da9c47'][i],weight:4,opacity:.85}}/>)}
  {showTraffic&&trafficZones.map(z=><Circle key={z.id} center={[z.latitude,z.longitude]} radius={z.radius} pathOptions={{color:'#e7a64f',fillColor:'#e7a64f',fillOpacity:.2,weight:1}}><Popup><b>High traffic · {z.location}</b><br/>Routes 24 and 18 affected</Popup></Circle>)}
  {showWater&&waterZones.map(z=><Circle key={z.id} center={[z.latitude,z.longitude]} radius={z.radius} pathOptions={{color:'#45bde9',fillColor:'#218bd0',fillOpacity:.42,weight:2}}><Popup><b>{z.id} · Waterlogging</b><br/>Water level {z.levelCm} cm · {z.severity} severity<br/>Affected routes: {z.affectedRoutes.join(', ')}</Popup></Circle>)}
  {showPedestrian&&pedestrianZones.map(z=><Circle key={z.id} center={[z.latitude,z.longitude]} radius={z.radius} pathOptions={{color:'#bd82e5',fillColor:'#a366cb',fillOpacity:.18,weight:1}}><Popup><b>Pedestrian zone · {z.name}</b><br/>Density {z.density}% · speed reduction active</Popup></Circle>)}
  {showStops&&stops.map(([name,position])=><Marker key={name} position={position} icon={stopIcon}><Popup><b>{name}</b><br/>Transit stop · Metro Region</Popup></Marker>)}
  {showBuses&&buses.map(bus=><Marker key={bus.id} position={[bus.latitude,bus.longitude]} icon={busIcon(bus.status,bus.passengers/bus.capacity)}><Popup className="fleet-popup"><div className="popup-kicker">LIVE VEHICLE</div><b>{bus.id} · Route {bus.route}</b><div className="popup-detail">Speed <strong>{bus.speed} km/h</strong></div><div className="popup-detail">Passengers <strong>{bus.passengers} / {bus.capacity} ({Math.round(bus.passengers/bus.capacity*100)}%)</strong></div><div className="popup-detail">ETA <strong>{bus.eta} min</strong></div><div className="popup-detail">Status <strong>{bus.status}</strong></div><div className="popup-detail">Driver <strong>{bus.driver}</strong></div><div className="popup-location">{bus.currentStop} → {bus.nextStop}</div></Popup></Marker>)}
  {showPotholes&&potholes.map(h=><CircleMarker key={h.id} center={[h.latitude,h.longitude]} radius={9} pathOptions={{color:'#f27a57',fillColor:'#ed523d',fillOpacity:.85,weight:2}}><Popup><b>{h.id} · {h.severity} pothole</b><br/>{h.road} · AI confidence {h.confidence}%<br/>Status: {h.status}</Popup></CircleMarker>)}
  {showIncidents&&incidents.filter(i=>i.status!=='Resolved').map(i=><CircleMarker key={i.id} center={[i.latitude,i.longitude]} radius={7} pathOptions={{color:'#ff777d',fillColor:'#d94756',fillOpacity:.8,weight:2}}><Popup><b>{i.type} · {i.severity}</b><br/>{i.message}<br/>{i.location}</Popup></CircleMarker>)}
  {showDensity&&buses.filter(b=>b.passengers/b.capacity>=.75).map(bus=><Circle key={`density-${bus.id}`} center={[bus.latitude,bus.longitude]} radius={105} pathOptions={{color:'#f1785b',fillColor:'#ee7054',fillOpacity:.16,weight:0}}/>)}
 </MapContainer>;
}
