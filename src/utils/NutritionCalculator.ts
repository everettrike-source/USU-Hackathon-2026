export type UserInformation = {
    age:number; 
    weight: number; 
    gender: 'male' | 'female'; 
    activityLevel: number;
    activityIntensity: number;
    heightFoot: number;
    heightInches: number;
}

export type ExtraInformation = {
    targetWeight: number;
    targetMonth: number;
}



export function calculateBaseCalories(user: UserInformation): number {
    const weightkg = user.weight / 2.20462; 
    const heightCm = (user.heightFoot * 12 + user.heightInches) * 2.54;
    const exerciseMin = user.activityLevel * 60/ 7
    let BMR = 0;
    
    // Modern Mifflin-St Jeor Equation
    if (user.gender === 'male') {
        BMR = (10 * weightkg) + (6.25 * heightCm) - (5 * user.age) + 5;
    } else {
        BMR = (10 * weightkg) + (6.25 * heightCm) - (5 * user.age) - 161;
    }

     BMR *= 1.2;
     if(exerciseMin > 0 && user.activityIntensity > 1.2) {
     BMR += (user.activityIntensity * 3.5 * weightkg / 200) * exerciseMin;
     }
    return Math.round(BMR);
}
//if under or over max or min alert them saying by that date that this is max/min weight healthly possible to reach.
export function bulkCutCalories(user: UserInformation, extra: ExtraInformation): number {
    const maintenance = calculateBaseCalories(user);
    const weightDifference = extra.targetWeight - user.weight;
    const daysToTarget = 30.5 * extra.targetMonth;  
    const totalCalorieShift = weightDifference * 3500;
    const finalTarget = maintenance + (totalCalorieShift/daysToTarget);
    if(finalTarget < 1200) {
        console.warn(`Your target calorie intake is very low. It's recommended to not go below 1200 calories per day for health reasons.`);
    }
    if(finalTarget > 5000) {
        console.warn(`Your target calorie intake is very high. It's recommended to not go above 5000 calories per day for health reasons.`);
    }
    return Math.round(Math.max(1200, Math.min(finalTarget, 5000)));
}
const Everett: UserInformation = {age:18,weight: 160, gender:'male',activityLevel: 5,activityIntensity: 8,heightFoot:6,heightInches:1};
const EverettExtra: ExtraInformation = {targetWeight: 200, targetMonth: 12};
const myBulkCutCalories = bulkCutCalories(Everett, EverettExtra);
console.log(calculateBaseCalories(Everett));
console.log(myBulkCutCalories);