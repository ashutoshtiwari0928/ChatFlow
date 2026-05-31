package com.channelService.ChannelService.Controller;

import com.channelService.ChannelService.Model.Channel;
import com.channelService.ChannelService.Service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channel")
@CrossOrigin(origins = "http://localhost:5173")
public class ChannelController {
    public ChannelService channelService;
    @Autowired
    public void setChannelService(ChannelService channelService) {
        this.channelService = channelService;
    }
    @GetMapping
    public List<Channel> getChannelList(){
        return channelService.getChannel();
    }
    @PostMapping
    public void createChannel(@RequestBody Channel channel){
        channelService.createChannel(channel);
    }
}
