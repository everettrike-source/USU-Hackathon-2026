export type UserInformation = {
    age:number; 
    weight: number; 
    gender: 'male' | 'female'; 
    activityLevel: number;
    heightFoot: number;
    heightInches: number;
    
}

export function calculateBaseCalories(user: UserInformation): number{
    const weightkg = user.weight * 0.453592; // Convert pounds to kg
    const realHeight = user.heightFoot * 12 + user.heightInches;
    let BMR = 0;
    if(user.gender === 'male'){
        BMR = 88.362 + (13.397 * weightkg) + (4.799 * realHeight) - (5.677 * user.age);
    }
    else{
        BMR = 44.593 + (9.247 * weightkg) + (3.098 * realHeight) - (4.330 * user.age);
    }

    BMR += user.activityLevel* (5.0 * 3.5 * weightkg)/200;

    return BMR;
}

const Everett: UserInformation = {age:18,weight: 160, gender:'male',activityLevel:900,heightFoot:6,heightInches:1};
const myCalories = calculateBaseCalories(Everett);
console.log(myCalories);