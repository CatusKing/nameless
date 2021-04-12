module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		cooldown: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		messages: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		weekly: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		daily: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		}
	}, {
		timestamps: false,
	});
};