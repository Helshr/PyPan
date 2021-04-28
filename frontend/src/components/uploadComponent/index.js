import React from 'react';
import { connect } from 'dva';
import { Upload, Icon, Button } from 'antd';
import UploadHistory from './UploadHistory';
import { print } from '../../utils/utils';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class UploadComponent extends React.Component {
  state = {
    progress: 0,
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  uploadImage = options => {
    const { file, onProgress } = options;
    
    const config = {
      headers: { "content-type": "multipart/form-data", "accept": "*/*", "X-Requested-With": "XMLHttpRequest" },
      onUploadProgress: event => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        this.setState({ progress: percent })
        if (percent === 100) {
          setTimeout(() => this.setState({ progress: 0 }), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      }
    };

    const { dispatch } = this.props;
    dispatch({
      type: "upload/uploadFile",
      payload: {
        file: file,
        config,
      }
    })
  };

  handleDeleteFileInfo = (fileMd5) => {
    const { dispatch } = this.props;
    dispatch({
      type: "upload/deleteFile",
      payload: {
        fileMd5,
      }
    })
  }

  render() {
    const { userFileList } = this.props;

    return (
      <div className="clearfix">
        <Upload
          // listType="picture-card"
          // onPreview={this.handlePreview}
          onRemove={file => this.deleteFile(file)}
          customRequest={this.uploadImage}
        >
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
        <UploadHistory userFileList={userFileList} handleDeleteFileInfo={this.handleDeleteFileInfo.bind(this)}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userFileList } = state.upload;
  return {
    userFileList,
  }
}

export default connect(mapStateToProps)(UploadComponent);