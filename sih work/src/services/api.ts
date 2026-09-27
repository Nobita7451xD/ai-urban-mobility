import { seedBuses, routes, alertsSeed, type Bus, type Incident } from '../data';
export type AnalyticsSnapshot={passengers:number;averageSpeed:number;averageDelay:number;utilization:number};
// Replace these Promise-based adapters with fetch calls to the production API.
export const fleetService={async getFleet():Promise<Bus[]>{return seedBuses},async getBus(id:string):Promise<Bus|undefined>{return seedBuses.find(bus=>bus.id===id)}};
export const routeService={async getRoutes(){return routes}};
export const incidentService={async getIncidents():Promise<Incident[]>{return alertsSeed}};
export const analyticsService={async getSnapshot(fleet:Bus[]):Promise<AnalyticsSnapshot>{const active=fleet.filter(bus=>bus.speed>0);return {passengers:fleet.reduce((sum,bus)=>sum+bus.passengers,0),averageSpeed:Math.round(active.reduce((sum,bus)=>sum+bus.speed,0)/Math.max(active.length,1)),averageDelay:Math.round(fleet.filter(bus=>bus.status==='Delayed').length/Math.max(fleet.length,1)*10)/10,utilization:Math.round(active.length/Math.max(fleet.length,1)*100)}}};
