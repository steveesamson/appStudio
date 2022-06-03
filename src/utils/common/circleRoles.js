/*
circle roles
admin ---all and permission
assessor--can create task, author and influencer
author ----author and influencer.
influencer ----- can only add member to circle
*/
export const withRole = (role) => (action) =>{
    switch(action){
        case 'manage-role':return role ==='admin';
        case 'create-task':return ['admin','assessor'].includes(role);
        case 'create-article':return ['admin','assessor','author'].includes(role);
        case 'add-member':return ['admin','assessor','author','influencer'].includes(role);
    }

}