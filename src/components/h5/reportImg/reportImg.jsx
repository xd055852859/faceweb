import React, { Component } from 'react';
import './reportImg.css';

class ReportImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportImg: '',
            picHeight: '',
            picWidth: ''
        }
    }
    async componentDidMount() {
        let scale = 0.9;
        let { location } = this.props;
        if (location.query) {
            let { picHeight, picWidth, reportImg } = location.query;
            let container = document.getElementById('reportImg-container');
            scale = container.offsetWidth / picWidth;
            this.setState({
                // picHeight: (picHeight / 100 * scale) + 'rem',
                // picWidth: (picWidth / 100 * scale) + 'rem',
                reportImg: reportImg+"?imageView2/0/h/300"
            })
        }
    }
    downloadImg() {

    }
    render() {
        let { picHeight, picWidth, reportImg } = this.state
        return (
            <div className="container" id="reportImg-container">
                <img src={reportImg}
                //  style={{ 'width': picWidth, 'height': picHeight }} 
                 className="reportImg" alt="" />
                {/* <a download="" href={reportImg}><img src="./images/downIcon.png" className="reportDownIcon" onClick={() => { this.downloadImg() }} alt="" /></a> */}
            </div>
        );
    }
}

export default ReportImg;