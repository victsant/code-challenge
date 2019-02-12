import React, {Fragment} from 'react';
import axios from 'axios';

import '../styles/application.scss';
import noImage from '../images/no-image-icon.png';

class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redditResults: null,
						searchVal: '',
						filteredResults: null
        };
				
				//Bind events
				this.searchSuggest = this.searchSuggest.bind(this);
    }

    /**
     * This method retrieves a reddit science data feed and sets the data into state as an array of:
     *
     * {
     *     url: "https:www.reddit.com/s/some-url",
     *     thumbnail: "https://b.thumbs.redditmedia.com/YHdl2LLiNLu_h2XgBsl2XtXcvj_YE1mJRnBlt7aizeo.jpg",
     *     title: "CDC study finds e-cigarettes responsible for dramatic increase in tobacco use among middle and high school students erasing the decline in teen tobacco product use from previous years."
     * }
     *
     */
    componentDidMount() {
        const component = this;
        axios.get('https://www.reddit.com/r/science.json').then(function(response) {
            const redditResults = response.data.data.children.map(node => {
                const data = node.data;
                return {
                    url: `https://www.reddit.com${data.permalink}`,
                    thumbnail: data.thumbnail,
                    title: data.title,
                };
            });
            component.setState({redditResults: redditResults});
        }).catch(function(error) {
            console.log(error);
        });
    }
		
		
		
		searchSuggest(e){
			this.setState({
				searchVal: e.target.value
			});
		}
		
		
		
    render() {
        const { redditResults, searchVal } = this.state;
				//Filter Results
				let filteredResults = null;
				if(redditResults !== null){
					 filteredResults = redditResults.filter((result) => {
						return result.title.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1;
					});
				}
				
				if(redditResults === null){
					return (
						<section className="loading-section">
							Loading results.....
						</section>
					);
				}
				
        return (
					<Fragment>
						<header>
							<div className="search-header">
								<h4>Search:</h4>
								<input 
									type="text" 
									name="search" 
									id="search" 
									placeholder="Begin typing to search"
									onKeyUp={this.searchSuggest}
								/>
							</div>
						</header>
            <section>
									<h4 className="results-header">Science Results</h4>
	                {filteredResults.length ? (
	                    <ul className="reddit-panel-container">
	                        {filteredResults.map((result, index) => (
	                            <li className="reddit-panel" key={index}>
	                                <a href={result.url}>
	                                    <strong>{result.title}</strong>
	                                    <img src={result.thumbnail} alt={result.title} onError={(e) => {e.target.src=noImage; }}/>
	                                </a>
	                            </li>
	                        ))}
	                    </ul>
	                ) : 
									<h4 className="empty-results">
										Sorry, there were no results for "<strong>{searchVal}</strong>"
									</h4>
								}
            </section>
					</Fragment>
        );
    }
}

export default IndexPage;
