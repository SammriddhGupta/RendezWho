function Event() {
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [nameCompleted, setNameCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { uniqueLink } = useParams();
  const [eventData, setEventData] = useState(null);

  const handleNameSubmit = () => {
    if (inputValue.trim() === "") return;

    const userName = inputValue.trim();
    setNames((prevNames) => [...prevNames, userName]);
    setCurrentUser(userName);
    console.log("Name submitted:", userName);
    setInputValue("");
    setNameCompleted(true);

    localStorage.setItem(`rendezwho_user_${uniqueLink}`, userName);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/events/${uniqueLink}`);
        const data = await response.json();
        setEventData(data);
        if (data.participants && Array.isArray(data.participants)) {
          setNames(data.participants);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventData();
    const savedUsername = localStorage.getItem(`rendezwho_user_${uniqueLink}`);
    if (savedUsername) {
      setCurrentUser(savedUsername);
      setNameCompleted(true);
    }
  }, [uniqueLink]);

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50">
      {/* Header */}
      <header className="w-full bg-violet-500 text-white text-2xl font-bold p-4 text-center">
        RendezWho
      </header>

      {/* Content Wrapper */}
      <main className="w-full max-w-6xl flex flex-col items-center p-6 gap-6">
        {/* Event Title */}
        {eventData ? (
          <h2 className="text-4xl font-semibold">{eventData.name}</h2>
        ) : (
          <p className="text-gray-500 text-2xl">Loading event details...</p>
        )}

        {/* Name Input & Display */}
        <div className="flex flex-wrap gap-3 items-center justify-center">
          {!nameCompleted ? (
            <div className="flex bg-gray-100 rounded-md p-2">
              <input
                className="w-48 pl-2 py-1 text-sm rounded-md text-gray-700 outline-none"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your name"
              />
              <button
                className="ml-2 px-3 py-1 bg-violet-500 text-white rounded-md text-sm"
                onClick={handleNameSubmit}
              >
                Add
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NameBox name={currentUser} />
              <button
                className="p-2 text-black hover:bg-gray-200 rounded-md"
                onClick={() => {
                  setNameCompleted(false);
                  localStorage.removeItem(`rendezwho_user_${uniqueLink}`);
                }}
              >
                <Pencil className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

          {/* Display Other Participants */}
          {names.filter((name) => name !== currentUser).map((n, index) => (
            <NameBox key={index} name={n} />
          ))}
        </div>

        {/* Main Content (Map, Availability, Voting) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Availability Section */}
          <div className="md:col-span-1">
            {nameCompleted ? (
              <Availability eventId={uniqueLink} username={currentUser} />
            ) : (
              <div className="p-4 bg-gray-100 rounded-md text-center">
                Please enter your name to mark your availability.
              </div>
            )}
          </div>

          {/* Map and Voting Section */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Map
              onLocationSelect={setSelectedLocation}
              onOptionAdded={() => fetchEventData()}
              eventId={uniqueLink}
              selectedLocation={selectedLocation}
              eventData={eventData}
            />
            <VotingBar options={eventData?.pollOptions || []} eventId={uniqueLink} />
          </div>
        </div>

        {/* Best Meeting Times */}
        {nameCompleted && (
          <div className="w-full mt-8 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Best Meeting Times</h3>
            <CombinedAvailability eventId={uniqueLink} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Event;
