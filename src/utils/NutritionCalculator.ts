export type UserInformation = {
    age:number; 
    weight: number; 
    gender: 'male' | 'female'; 
    activityLevel: number;
    heightFoot: number;
    heightInches: number;
}

export type ExtraInformation = {
    targetWeight: number;
    targetMonth: number;
    bmr: number;
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
     BMR += exerciseMin * (5.0 * 3.5 * weightkg) / 200;
    user.bmr = BMR;
    return Math.round(BMR);
}
//if under or over max or min alert them saying by that date that this is max/min weight healthly possible to reach.
export function bulkCutCalories(user: UserInformation, extra: ExtraInformation): number {
    const weightDifference = extra.targetWeight - user.weight;
    const daysToTarget = 30.5 * extra.targetMonth;  
    const totalCalorieShift = weightDifference * 3500;
    const finalTarget = extra.bmr + (totalCalorieShift/daysToTarget);
    return Math.round(Math.max(1200, Math.min(finalTarget, 5000)));
}
const Everett: UserInformation = {age:18,weight: 160, gender:'male',activityLevel: 14,heightFoot:6,heightInches:1};
const myCalories = calculateBaseCalories(Everett);
console.log(myCalories);