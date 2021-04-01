from flask import jsonify


class Res:

    @staticmethod
    def res_200(res_data):
        return jsonify({
            "status": 200,
            "data": res_data,
        })
    
    @staticmethod
    def res_203():
        return jsonify({
            "status": 203,
        })
    
    @staticmethod
    def res_503(res_data):
        return jsonify({
            "status": 503,
            "data": res_data,
        })
