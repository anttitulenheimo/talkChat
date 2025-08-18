

const FindUser = ({ 
        findUsername,
        setFindUsername,
        handleFindUser,
        foundUser,
        setFoundUser,
        handleNewChat }) => {

    const userExistsRender = ( // When user exist, render this
        <div>
            <h3>Username <em>{findUsername}</em> found <button onClick={handleNewChat}>Message</button></h3>
        </div>
    )
    return (
        <div>
            <form onSubmit={handleFindUser}>
                <div>
                    Search for user: <input 
                        type='text'
                        value={findUsername}
                        onChange={({ target }) => {setFindUsername(target.value); setFoundUser('')}}
                        />
                        <button type='submit'>Search</button>

                </div>
            </form>
            {foundUser ? userExistsRender : <div></div>}
        </div>
    )

}






export default FindUser