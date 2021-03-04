// console.log(JSON.stringify(mainDefinitelyItThisTime14(), null, 2))
console.log(JSON.stringify(main(), null, 2))

// return an object with the id, title, actors of the media, plus the programName and longTitle of the associated program
function main() {
  let media = getMedia()
  //let getBANANA = getEntertainmentData()
  let entertainmentData = getEntertainmentData()
  media = JSON.parse(media)
  entertainmentData = JSON.parse(entertainmentData)
  let program = entertainmentData.data.filter(x=>{return x.id===media.programId})[0]
  // This exracts the package
  let value = {
    id: media.id,
    title: media.title, // 60 * 60 seconds
    actors: media.actors,
    programName: program.programName,
    longTitle: program.longTitle
  }

  return {
    id: media.id,
    title: media.title, // 60 * 60 seconds
    actors: media.actors,
    programName: program.programName,
    longTitle: program.longTitle
  };
}
// <this shouldn't change>
// API mock
function getMedia() {
  let value = {
    objectType: 'media',
    id: 123,
    title: 'title',
    description: 'description',
    actors: ['Morgan Freeman', 'Anthony Hopkins', 'Idris Elba', 'Clint Eastwood', 'Joaquin Phoenix'],
    programId: 456
  }

  return(JSON.stringify(value, null, 2))
}

// API mock
function getEntertainmentData() {
  let value = {
    data: [
      {
        objectType: 'program',
        id: 123,
        title: 'program1',
        programName: 'programName1',
        description: 'description1',
        genre: 'action',
        longTitle: 'looooooong title1'
      },
      {
        objectType: 'program',
        id: 456,
        title: 'program2',
        programName: 'programName2',
        description: 'description2',
        genre: 'sci-fi',
        longTitle: 'looooooong title2'
      },
      {
        objectType: 'series',
        id: 789,
        title: 'program3',
        programName: 'programName3',
        description: 'description3',
        genre: 'sci-fi',
        longTitle: 'looooooong title3'
      },
    ]
  }

  return(JSON.stringify(value, null, 2))
}
// </this shouldn't change>

