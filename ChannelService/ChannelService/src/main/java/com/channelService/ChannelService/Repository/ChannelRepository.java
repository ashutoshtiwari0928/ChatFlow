package com.channelService.ChannelService.Repository;

import com.channelService.ChannelService.Model.Channel;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ChannelRepository extends JpaRepository<Channel,Integer> {
}
