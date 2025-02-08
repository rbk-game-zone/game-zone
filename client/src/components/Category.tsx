import React from 'react';


const Category = ({ games }: { games: any }) => {
    console.log(games, "gamessssssssssssssssssssssssssssssssssssssssssssssssssss");
    return (
        <div className="container mt-4">
            <div className="row">
                {games.map((game: any) => (
                    <div key={game.id} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img src={game.thumbnail} className="card-img-top" alt={game.title} />
                            <div className="card-body">
                                <h5 className="card-title">{game.title}</h5>
                                <p className="card-text">{game.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
