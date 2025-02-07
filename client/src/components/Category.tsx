import React from 'react';

const Category = ({games}:{games:any}) => {
    console.log(games,"gamessssssssssssssssssssssssssssssssssssssssssssssssssss");
    return (
        <div>
            <h1>Category</h1>

            {games.map((game:any)=>(
                <div key={game.id}>
                    <h2>{game.title}</h2>
                    <h2>{game.description}</h2>
                    <img src={game.thumbnail} />
                </div>
            ))}
        </div>


    );
};

export default Category;