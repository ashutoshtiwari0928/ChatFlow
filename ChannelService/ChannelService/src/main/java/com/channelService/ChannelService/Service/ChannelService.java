package com.channelService.ChannelService.Service;

import com.channelService.ChannelService.Model.Channel;
import com.channelService.ChannelService.Repository.ChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelService {
    private ChannelRepository channelRepository;
    @Autowired
    public void setChannelRepostory(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }
    public List<Channel> getChannel(){
        return channelRepository.findAll();
    }
    public void createChannel(Channel channel){
        channelRepository.save(channel);
    }
}
