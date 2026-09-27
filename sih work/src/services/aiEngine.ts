import type { Bus, Incident } from '../data';
export type Recommendation={id:string;title:string;reason:string;asset:string;priority:'Urgent'|'High'|'Medium';impact:string;confidence:number};
export function getRecommendations(fleet:Bus[],incidents:Incident[]):Recommendation[]{
 const items:Recommendation[]=[];
 const water=incidents.find(i=>i.type==='Waterlogging'&&i.status==='Open');
 if(water){const b=fleet.find(x=>x.route===water.route&&x.status!=='Offline');if(b)items.push({id:`water-${b.id}`,title:`Reroute ${b.id} around waterlogging`,reason:`${water.location} has ${water.severity.toLowerCase()} waterlogging; ${b.route} is affected.`,asset:b.id,priority:'Urgent',impact:'Avoid about 9 min delay',confidence:94})}
 const traffic=incidents.find(i=>i.type==='Traffic'&&i.status==='Open');
 if(traffic)items.push({id:'traffic-route24',title:'Deploy capacity on Route 24',reason:`Traffic detected near ${traffic.location}; reduce headway through the corridor.`,asset:'Route 24',priority:'High',impact:'Reduce peak wait by 8 min',confidence:91});
 const crowded=fleet.find(b=>b.passengers/b.capacity>.85&&b.status!=='Offline');
 if(crowded)items.push({id:`load-${crowded.id}`,title:`Send relief bus to ${crowded.id}`,reason:`Occupancy reached ${Math.round(crowded.passengers/crowded.capacity*100)}% on Route ${crowded.route}.`,asset:crowded.id,priority:'High',impact:'Restore capacity to safe levels',confidence:96});
 const pothole=incidents.find(i=>i.type==='Pothole'&&i.status==='Open');
 if(pothole)items.push({id:'maint-pothole',title:'Dispatch road maintenance to MG Road',reason:'High severity pothole detected on a monitored bus corridor.',asset:'POTHOLE-024',priority:'Medium',impact:'Reduce road hazard exposure',confidence:94});
 return items;
}
