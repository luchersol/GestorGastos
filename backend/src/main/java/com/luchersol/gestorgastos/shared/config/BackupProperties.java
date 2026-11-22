package com.luchersol.gestorgastos.shared.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.backup")
public class BackupProperties {

    private String directory;

    private int dailyRetention = 7;

    private int weeklyRetention = 4;

    private int monthlyRetention = 6;

    public String getDirectory() {
        return directory;
    }

    public void setDirectory(String directory) {
        this.directory = directory;
    }

    public int getDailyRetention() {
        return dailyRetention;
    }

    public void setDailyRetention(int dailyRetention) {
        this.dailyRetention = dailyRetention;
    }

    public int getWeeklyRetention() {
        return weeklyRetention;
    }

    public void setWeeklyRetention(int weeklyRetention) {
        this.weeklyRetention = weeklyRetention;
    }

    public int getMonthlyRetention() {
        return monthlyRetention;
    }

    public void setMonthlyRetention(int monthlyRetention) {
        this.monthlyRetention = monthlyRetention;
    }
}