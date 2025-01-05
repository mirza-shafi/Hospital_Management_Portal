import React, { useEffect, useState } from 'react';
import './styles/NewsTicker.css';
import axios from 'axios';

const NewsTicker = () => {
    const [news, setNews] = useState([]);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchBloodRequests = async () => {
            try {
                const response = await axios.get('/api/bloodrecipient'); 
                setNews(response.data.slice(0, 2)); 
            } catch (error) {
                console.error('Error fetching blood requests', error);
            }
        };

        fetchBloodRequests();
    }, []);

    useEffect(() => {
        if (news.length > 0) {
            setIsVisible(true);
            const interval = setInterval(() => {
                if (currentNewsIndex === news.length - 1) {
                    setIsVisible(false);
                    clearInterval(interval); 
                } else {
                    setCurrentNewsIndex((prevIndex) => prevIndex + 1);
                }
            }, 2500); 

            return () => {
                clearInterval(interval);
            };
        }
    }, [news, currentNewsIndex]);

    return (
        <div className={`news-ticker-wrapper ${isVisible ? 'show' : 'hide'}`}>
            {news.length > 0 && (
                <div className="news-ticker">
                    <div className="news-item">
                        <span className="timestamp">
                            {new Date(news[currentNewsIndex].createdAt).toLocaleString()}
                        </span>
                        <span className="news-content">
                            <strong>Blood Group {news[currentNewsIndex].bloodNeeded}</strong> needed for <strong>{news[currentNewsIndex].firstName} {news[currentNewsIndex].lastName}</strong>, Total Bags: <strong>{news[currentNewsIndex].totalBagsNeeded}</strong>, Contact: <strong>{news[currentNewsIndex].phoneNumber}</strong>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsTicker;
