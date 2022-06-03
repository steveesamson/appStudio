export const genTasks = () =>{
  const a = [];
  for(let i =0; i< 30; ++i){
    a.push({id:(i+1),status:'activated', title:`Another task ${(i + 1)}`,createdBy:'bobsteve'})
  }
  return a;
}

export const genUserTasks = () =>{
  const a = [];
  for(let i =0; i< 30; ++i){
    a.push({id:(i+1),submitted:true, title:`Another task ${(i + 1)}`,createdBy:'bobsteve'})
  }
  return a;
}

export const getSubmissions = () =>{
    return [
        { id: 1,  streamId:'streamId1', endTime:new Date() },
        { id: 2,  streamId:'streamId', endTime:new Date() },
        { id: 3,  streamId:'streamId', endTime:new Date() },
        { id: 4,  streamId:'streamId', endTime:new Date() },
        { id: 5,  streamId:'streamId', endTime:new Date() },
        { id: 6,  streamId:'streamId', endTime:new Date() },
        { id: 7,  streamId:'streamId', endTime:new Date() },
        { id: 8,  streamId:'streamId', endTime:new Date() },
        { id: 9,  streamId:'streamId', endTime:new Date() },
        { id: 10,  streamId:'streamId', endTime:new Date() },
        { id: 11,  streamId:'streamId', endTime:new Date() },
        { id: 12,  streamId:'streamId', endTime:new Date() },
        { id: 13,  streamId:'streamId', endTime:new Date() },
        { id: 14,  streamId:'streamId', endTime:new Date() },
        { id: 15,  streamId:'streamId', endTime:new Date() },
        { id: 16,  streamId:'streamId', endTime:new Date() },
        { id: 17,  streamId:'streamId', endTime:new Date() },
        { id: 18,  streamId:'streamId', endTime:new Date() },
        { id: 19,  streamId:'streamId', endTime:new Date() },
        { id: 20,  streamId:'streamId', endTime:new Date() },
        { id: 21,  streamId:'streamId21', endTime:new Date() },
    ];
}

export const getQuestions = () =>{
    return [
    {id:1, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:2, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:3, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:4, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:5, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:6, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:7, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:8, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:9, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:10, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:11, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:12, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:13, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:14, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:15, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:16, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:17, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:18, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:19, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:20, tag:'tag-name', type:'some-type', questionText:'Question text here..,'},
    {id:21, tag:'tag-name 21', type:'some-type', questionText:'Question text here..,'},
  ]
}

export const getArticles = () =>{
  const a = [];
  for(let i =0; i< 30; ++i){
    a.push({id:(i+1),slug:`slug-name-${i}`, title:`Article title${(i + 1)}`,createdBy:'bobsteve',tags:['technologies'],visibility:'public'})
  }
  return a;

}

export const getUserCircles = () =>{
    return [
  {
    id: 1,
    name: "Class of '93",
    description: 'Circle of all my high school mates at DMGS.',
    type: 'colab',
    createdAt: '2021-08-24T07:46:07.248+01:00',
    createdBy: 'solotone',
    members: 5,
  },

  /* 2 createdAt:03/09/2021, 16:39:43*/
  {
    id: 2,
    name: 'Prospects',
    description: 'People I want to sell to.',
    type: 'colab',
    createdAt: '2021-09-03T16:39:43.553+01:00',
    createdBy: 'miky',
    members: 0,
  },

  /* 3 createdAt:03/09/2021, 16:44:46*/
  {
    id: 3,
    name: 'My buyers club 1',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 4,
    name: 'My buyers club 2',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 5,
    name: 'My buyers club 3',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 6,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 7,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 8,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 9,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 10,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 11,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 12,
    name: 'My buyers club',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
  {
    id: 13,
    name: 'My buyers club last one',
    description: 'I will sell to them',
    type:'colab',
    createdAt: '2021-09-03T16:44:46.956+01:00',
    createdBy: 'solotone',
    members: 4,
  },
];

}

export const getUserTots = () =>{

    const a = [];
  for(let i =0; i< 30; ++i){
    a.push({id:(i+1),streamId:`bobsteve`, createdBy:'bobsteve', title:`Code freak`,email:'sam@sam.com',visibility:'public',text:`There are so many ways to skin a cat, especially, the tough one.`, likes:3, reactions:3})
  }
  return a;

}

export const getFollowings = () =>{

    const a = [];
  for(let i =0; i< 30; ++i){
    a.push({id:(i+1),streamId:`bobsteve${i + 1}`, user:'bobsteve', title:`Code freak`})
  }
  return a;

}