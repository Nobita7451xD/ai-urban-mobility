import { routePaths, routeStops, type Bus, type Incident } from '../data';

const interpolate = (points:[number,number][], progress:number):[number,number] => {
  const scaled=((progress%1)+1)%1*(points.length-1); const i=Math.floor(scaled); const t=scaled-i;
  const a=points[i], b=points[Math.min(i+1,points.length-1)]; return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
};
const bearing=(a:[number,number],b:[number,number])=>(Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI+360)%360;
export function advanceFleet(fleet:Bus[],incidents:Incident[],now=Date.now(),stepSeconds=3):Bus[]{
  return fleet.map((bus,index)=>{
    if(bus.status==='Offline'||bus.status==='Maintenance'||bus.status==='Emergency') return {...bus,speed:0,lastUpdated:now};
    const points=routePaths[bus.route]||routePaths['24'];
    const traffic=incidents.some(i=>i.status==='Open'&&i.type==='Traffic'&&(!i.route||i.route===bus.route));
    const water=incidents.some(i=>i.status==='Open'&&i.type==='Waterlogging'&&(!i.route||i.route===bus.route));
    const pedestrian=incidents.some(i=>i.status==='Open'&&i.type==='Pedestrian'&&(!i.route||i.route===bus.route));
    const occupancy=bus.passengers/bus.capacity;
    const cruise=26+(index*7)%14;
    const speed=Math.max(7,Math.round(cruise*(traffic?.52:1)*(water?.34:1)*(pedestrian?.42:1)));
    const progress=(bus.routeProgress+(speed/3600*stepSeconds/12))%1;
    const [latitude,longitude]=interpolate(points,progress);
    const prior=interpolate(points,bus.routeProgress);
    const stopIndex=Math.floor(progress*(routeStops[bus.route]?.length||5))%(routeStops[bus.route]?.length||5);
    const stops=routeStops[bus.route]||routeStops['24'];
    const atStop=Math.floor(bus.routeProgress*100)%17===0;
    const passengerDelta=atStop?((index+Math.floor(now/3000))%2?3:-2):0;
    const passengers=Math.max(0,Math.min(bus.capacity, bus.passengers+passengerDelta));
    const delayed=traffic||water||pedestrian||occupancy>.85;
    const nextStop=stops[(stopIndex+1)%stops.length];
    const remainingKm=Math.max(.4,(1-progress)*12);
    const eta=Math.max(1,Math.round(remainingKm/Math.max(speed,8)*60));
    return {...bus,latitude,longitude,heading:bearing(prior,[latitude,longitude]),routeProgress:progress,speed,passengers,eta,status:delayed?'Delayed':'On time',location:stops[stopIndex],currentStop:stops[stopIndex],nextStop,vehicleHealth:Math.max(55,bus.vehicleHealth-(water&&index===0?.02:0)),fuelLevel:Math.max(8,bus.fuelLevel-(speed>0?.006:0)),lastUpdated:now};
  });
}
export function rerouteBus(bus:Bus,newRoute='11'):Bus{return {...bus,route:newRoute,routeProgress:.03,status:'On time',eta:Math.max(3,bus.eta-4),location:'City Mall',currentStop:'City Mall',nextStop:(routeStops[newRoute]||routeStops['11'])[1]};}
