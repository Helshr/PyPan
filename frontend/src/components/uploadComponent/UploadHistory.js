import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

import { print } from '../../utils/utils';


class UploadHistory extends React.Component {

    deleteItem = (fileMd5) => {
        print("will delete md5 is: ", fileMd5);
        this.props.handleDeleteFileInfo(fileMd5);
    }

    getColumns = () => {
        return [
            {
                title: "FileName",
                dataIndex: "file_name",
                key: "file_name",
            },
            {
                title: "UploadAt",
                dataIndex: "file_upload_at",
                key: "file_upload_at",
            },
            {
                title: "FileSize",
                dataIndex: "file_size",
                key: "file_size",
            },
            {
                title: "Action",
                key: "file_md5",
                render: (fileInfo) => {
                    let fileMd5 = fileInfo['file_md5'];
                    print("### debug md5 is : ", fileInfo['file_md5']);
                    return (
                        <span>
                      <a onClick={() => this.deleteItem(fileMd5)}>{`Delete`}</a>
                    </span>
                    )
                },
            },
        ]
    }
 
    render() {
        const columns = this.getColumns();
        const { userFileList } = this.props;
        print("### DEBUG: ", userFileList);
        return (
            <div>
                <Table columns={columns} dataSource={userFileList} />
            </div>
        );
    }
}

export default UploadHistory;