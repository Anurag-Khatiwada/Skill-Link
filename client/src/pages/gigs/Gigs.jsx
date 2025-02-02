import React, { useState, useRef, useEffect } from 'react';
import './Gigs.css';
import { useQuery } from '@tanstack/react-query';
import GigCards from '../../components/gigCards/GigCards';
import newRequest from '../../utils/newRequest';
import { Link, useLocation } from 'react-router-dom';
import NotFound from '../../components/notFound/NotFound';

const Gigs = () => {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState('sales');
  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation(); // Extracting search query from the location

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get the value of the 'cat' query parameter
  const cat = searchParams.get('cat');

  
  // Fetching services using React Query
  // const { isLoading, error, data, refetch } = useQuery({
  //   queryKey: ['services', search], // Include search in the query key
  //   queryFn: async () => {
  //     const minValue = minRef.current?.value || 0; // Default to 0 if no value is provided
  //     const maxValue = maxRef.current?.value || 1000000000000; // Default to a high number or any max value you choose

  //     try {
  //       const response = await newRequest.get(`/services${search.toLowerCase()}&min=${minValue}&max=${maxValue}&sort=${sort}`);
  //       console.log(response)
  //       return response.data; // Return the data from the response
  //     } catch (err) {
  //       console.error('Error Response:', err.response); // Log the full error response for debugging
  //       throw new Error(err.response?.data?.message || 'Failed to fetch data'); // Error handling
  //     }
  //   },
  //   refetchOnWindowFocus: false, // Prevent refetch on window focus
  // });

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['services', search], // Include search in the query key
    queryFn: async () => {
      const minValue = minRef.current?.value || 0;
      const maxValue = maxRef.current?.value || 1000000000000;
  
      try {
        const response = await newRequest.get(
          `/services${search.toLowerCase()}&min=${minValue}&max=${maxValue}&sort=${sort}`
        );
        console.log(response);
        return response.data;
      } catch (err) {
        console.error('Error Response:', err.response);
        throw new Error(err.response?.data?.message || 'Failed to fetch data');
      }
    },
    refetchOnWindowFocus: false,
  });

  // Resort function to update sort state
  const resort = (type) => {
    setSort(type);
    setOpen(false);
  };
  useEffect(() => {
    refetch();

  }, [sort])
  

  const apply = () => {
    refetch(); // Trigger a refetch with the current filters
  };




  // Loading and error states
  if (isLoading) return <NotFound isLoading={true} />;
  if (error) return <div><NotFound 
  message={{
    main: "No services found", 
    sub: "Oops! The service you are looking for doesn't exist."
  }} 
/></div>;

  return (
    <div className="gigs">
      <div className="gigsContainer">
        <span className="breadcrumbs"><Link className='link' to='/'>SKILL-LINK</Link> {'>'} {data?.[0]?.cat.toUpperCase()}</span>
        <h1>{data?.[0]?.cat.toUpperCase()}</h1>
        <p>Explore Art and Technologies Here</p>
        <div className="menue">
          <div className="menueLeft">
            <span>Budget</span>
            <input type="text"  placeholder="min" ref={minRef} />
            <input type="text"  placeholder="max" ref={maxRef} />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="menueRight">
            <span className="sortBy">Sort By</span>
            <span className="sortType">{sort === 'sales' ? 'Best Selling' : 'Newest'}</span>
            <img src="./img/down.svg" alt="Sort menu" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenue">
                {sort === 'sales' ? (
                  <span onClick={() => resort('createdAt')}>Newest</span>
                ) : (
                  <span onClick={() => resort('sales')}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="cards">
        {data?.map(gig => (
          <GigCards key={gig._id} item={gig} />
        ))}
      </div>
    </div>
  );
};

export default Gigs;


