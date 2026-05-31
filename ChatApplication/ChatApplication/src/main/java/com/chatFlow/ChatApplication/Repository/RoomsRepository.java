package com.chatFlow.ChatApplication.Repository;

import com.chatFlow.ChatApplication.Model.Message;
import com.chatFlow.ChatApplication.Model.Rooms;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomsRepository extends JpaRepository<Rooms, Integer> {
}
